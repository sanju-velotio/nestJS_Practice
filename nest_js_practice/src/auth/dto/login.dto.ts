import {IsString,IsEmail} from "class-validator"

export  class loginDto{
    @IsEmail()
    email:string

    @IsString()
    password:string
}