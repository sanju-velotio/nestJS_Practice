
import {Controller, Get, Post, Delete, Patch,Req,Body,Param} from "@nestjs/common"
import { UserService } from "./user.service"
import {Request} from "express"
import { UserInfoInterface } from "./dto/user.dto"
import { User1Entity } from "src/db/Entities/user.entity"


@Controller("user")
export class UserController{
    constructor(private readonly userService:UserService){} 
    @Get("/all")
    getUser():Promise<User1Entity[]>{
        try {
            return this.userService.getAllUsers()
        } catch (err) {
            console.log("error on get user")
            console.log(err)
            throw new Error(err)
        }
    }

    @Get("/:id")
    getUserById(@Param() param:{id:string}):Promise<string | User1Entity>{
        try {
            return this.userService.getUserById(param.id)
        } catch (err) {
            console.log("error during get user via id",err)
        }
    }
    @Post("/add")
    addUser(@Req() req:Request,@Body() incomingUserBody:UserInfoInterface):Promise<string>{
        try {
            return this.userService.addNewUser(incomingUserBody.name,incomingUserBody.lname,incomingUserBody.age,incomingUserBody.email,incomingUserBody.password)
        } catch (err) {
            console.log("error on add point",err)
            throw new Error(err)
        }
    }
    @Patch("/update/:id")
    updateUser(@Req() req:Request, @Body() userEmailForUpdation:Pick<UserInfoInterface,"email">,@Param() params:{id:string}):Promise<string>{
        try {
            return  this.userService.updateUser(userEmailForUpdation.email,params.id)
        } catch (err) {
            console.log("error on update end point",err)
            console.log(err)
            throw new Error(err)
        }
    }
    @Delete("/delete/:id")
    deleteUser(@Req() req:Request, @Param() params:{id:string}):Promise<string>{
        try {
            return this.userService.deleteUser(params.id)
        } catch (err) {
            console.log("error on delete end point",err)
            throw new Error(err)
        }
    }
}