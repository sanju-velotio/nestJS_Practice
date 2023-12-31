
import { Controller, Get, Post, Delete, Patch, Body, Param, HttpException,Res, NotFoundException, ParseIntPipe, HttpStatus, ParseUUIDPipe, UseGuards, UseInterceptors } from "@nestjs/common"
import { UserService } from "./user.service"
import { UserInfoInterface } from "./dto/user.dto"
import { User1Entity } from "src/db/Entities/user.entity"
import { AuthGuard } from "@nestjs/passport"
import { UserInterCeptor } from "./interceptor/user.interceptors"


@Controller("user")
@UseInterceptors(UserInterCeptor)
export class UserController {
    constructor(private readonly userService: UserService) { } 

    // @UseGuards(AuthGuard("jwt"))
    @Get("/all")
    async getUser(): Promise<User1Entity[]> {
        try {
            return this.userService.getAllUsers()
        } catch (err) {
            console.log("error on get all Users",err)
            throw new HttpException(err, 500)
        }
    }

    @Get("/:id")
    async getUserById(@Param("id") id: string) { 
        try {
            console.log(id)
           return this.userService.getUserById(id)
        } catch (err) {
            console.log("error during get user via id", err)
            throw new HttpException(err, 500)
        }
    }

    @Post("/add")
    async addUser(@Body() incomingUserBody: UserInfoInterface) {
        try {
          return  this.userService.addNewUser(
                incomingUserBody.name,
                incomingUserBody.lname,
                incomingUserBody.age,
                incomingUserBody.email,
                incomingUserBody.password
                )
        } catch (err) {
            console.log("error on add point", err)
            throw new HttpException("server error", 500)
        }
    }

    @Patch("/update/:id")
   async updateUser( @Body() userEmailForUpdation: Pick<UserInfoInterface, "email">, @Param() params: { id: string }) {
        try {
            return this.userService.updateUser(userEmailForUpdation.email, params.id)
        } catch (err) {
            console.log("error on update end point", err)
            console.log(err)
            throw new HttpException(err, 500)
        }
    }

    @Delete("/delete/:id")
   async deleteUser(@Param() params: { id: string }) {
    console.log(params)
        try {
            const result= await this.userService.deleteUser(params.id)
            console.log({result})
        } catch (err) {
            console.log("error on delete end point", err)
            throw new HttpException(err, 500)
        }
    }


    @Get("/age/:id")
    getUserByAge(@Param("id",new ParseIntPipe({errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE})) id:number){
        try {
            return this.userService.getUserbyAge(id)
        } catch (err) {
            console.log(err)
            throw new HttpException(err, 500)
        }
    }
}