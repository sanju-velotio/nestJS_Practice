import {Controller, Post,Body, HttpStatus, HttpCode} from "@nestjs/common"
import { loginDto } from "./dto/login.dto"
import { UserService } from "src/User/user.service"



@Controller("auth")
export class AuthController{
    constructor(private readonly userService:UserService){}
    @Post("/login")
    @HttpCode(200)
    login(@Body() loginDto:loginDto){
        console.log({loginDto})
        return this.userService.getUserViaEmail(loginDto.email,loginDto.password)
    }
}
