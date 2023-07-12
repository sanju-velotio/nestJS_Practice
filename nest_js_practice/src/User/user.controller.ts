
import { Controller, Get, Post, Delete, Patch, Body, Param, HttpException,Res, NotFoundException } from "@nestjs/common"
import { UserService } from "./user.service"
import { Request, Response } from "express"
import { UserInfoInterface } from "./dto/user.dto"
import { User1Entity } from "src/db/Entities/user.entity"



@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) { } // TODO re-again in deeply


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
    async getUserById(@Param() param: { id: string }) { //TODO: don;t pass res
        try {
           const result= await this.userService.getUserById(param.id)
            return result
        } catch (err) {
            console.log("error during get user via id", err)
            throw new HttpException(err, 500)
        }
    }
    @Post("/add")
    async addUser(@Body() incomingUserBody: UserInfoInterface) {
        try {
          return await this.userService.addNewUser(
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
   async updateUser(@Res() res: Response, @Body() userEmailForUpdation: Pick<UserInfoInterface, "email">, @Param() params: { id: string }) {
        try {
            const result= await this.userService.updateUser(userEmailForUpdation.email, params.id)
            if(result.statusCode===200){
                return res.status(200).json(result)
            }
            else if(result.statusCode===400){
                return res.status(400).json(result)
            }
            else if(result.statusCode===404){
                return res.status(404).json(result)
            }
        } catch (err) {
            console.log("error on update end point", err)
            console.log(err)
            throw new HttpException(err, 500)
        }
    }
    @Delete("/delete/:id")
   async deleteUser(@Res() res: Response, @Param() params: { id: string }) {
        try {
            const result= await this.userService.deleteUser(params.id)
            if(result.statusCode===200){
                return res.status(200).json(result)
            }
            else if(result.statusCode===404){
                return res.status(404).json(result)
            }
        } catch (err) {
            console.log("error on delete end point", err)
            throw new HttpException(err, 500)
        }
    }
}