import { Controller,Get, UseGuards,Post } from "@nestjs/common";
import { AppService } from "./app.service";
import {AuthGuard} from "@nestjs/passport"


@Controller("/app")
export class AppController {
    //pass service class as depedancy injections inside this  class
    constructor(private readonly appService:AppService){}
    
    @Get()
    getHomePage(){
        return this.appService.getUser()
    }

    @UseGuards(AuthGuard("local")) // built in aith gaurd
    @Post("/auth")
    getPrivateHome(){
        return "this is private routes"
    }
}