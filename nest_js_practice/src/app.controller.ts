import { Controller, Get,Post, Delete, Patch } from "@nestjs/common";




@Controller("/app")
export class AppController{

    @Get("/home")
    homePage(){
        return "this is Home page"
    
    }

    @Post("/add")
    AboutPage(){
        return "this is about page"
    }

    @Patch("/update/user")
    ContactPage(){
        return "this is Contact page"
    }
}