import { IsEmail, IsNotEmpty, IsString, isNotEmpty } from "class-validator";

export class registerDto {
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    password:string;
}