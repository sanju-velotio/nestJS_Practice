import { Controller, Post, Body, HttpStatus, HttpCode, HttpException,Req, UseGuards } from "@nestjs/common"
import { loginDto } from "./dto/login.dto"
import { AuthService } from "./auth.service"
import { registerDto } from "./dto/register.dto"
import { Tokens } from "./types/signup.types"
import { AuthGuard } from "@nestjs/passport"
import {Request} from "express"

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService:AuthService) {}

    @Post("/signup")
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerDTO:registerDto):Promise<Tokens> {
        try {
            return this.authService.register(registerDTO)
        } catch (err) {
            console.log("error during registration", err)
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post("/login")
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: loginDto):Promise<Tokens> {
        try {
            console.log({ loginDto })
            return this.authService.login(loginDto)
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @UseGuards(AuthGuard("jwt")) //pass strategy name for access token, protected routes
    @Post("/logout")
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req:Request) { //TODO: replace Req with custom request decorators
        try {
            const user= req.user
            console.log("on logout endpoint request parameters",user)
            return this.authService.logout(user["userId"])
        } catch (err) {
            console.log("error during logout", err)
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    @UseGuards(AuthGuard("jwt-refresh")) // pass strategy name for refresh token, protected routes
    @Post("/refresh")
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Req() req:Request) {  //TODO: replace Req with custom request decorators
        try {
            const user= req.user
            console.log("on refresh end-point",user)
            return this.authService.refreshToken(user["userId"],user["refreshToken"])
        } catch (err) {
            console.log("error during get refresh token", err)
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
