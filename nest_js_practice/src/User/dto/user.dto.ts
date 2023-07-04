import {IsString,IsEmail,IsNumber} from "class-validator"

export class UserInfoInterface{
    @IsString()
    name:string

    @IsString()
    lname:string

    @IsNumber()
    age:number

    @IsEmail()
    email:string
    @IsString()
    password:string

}