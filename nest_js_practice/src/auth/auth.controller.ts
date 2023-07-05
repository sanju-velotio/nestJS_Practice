import {Controller, Post,Body} from "@nestjs/common"
import { loginDto } from "./dto/login.dto"
import { UserService } from "src/User/user.service"



@Controller("auth")
export class AuthController{
    constructor(private readonly userService:UserService){}
    @Post("/login")
    login(@Body() loginDto:loginDto){
        console.log({loginDto})
        return this.userService.getUserViaEmail(loginDto.email,loginDto.password)
    }
}
