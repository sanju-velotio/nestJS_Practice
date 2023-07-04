import { Injectable } from "@nestjs/common";


@Injectable()


export class AppService{
    getUser(){
        return "Home Pages"
    }
}