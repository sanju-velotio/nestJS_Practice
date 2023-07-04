import {Controller,Get, Param} from "@nestjs/common"



@Controller()
export class UserController{
    @Get("/user")
    getUser(){
        return `this is Sanju Kumar`
    }
    @Get(":name")
    getUserByNamme(@Param() name:{name:string}){
        console.log(name)
        return `this is ${name.name}`
    }
}