import {PassportStrategy} from "@nestjs/passport"
import { Strategy } from "passport-local"
import {Injectable, UnauthorizedException} from "@nestjs/common"
import { userService } from "src/user/user.service"
import { UserEntity } from "src/Entities/user.entity";


@Injectable()
export class PassportLocalStrategy extends PassportStrategy(Strategy){

    constructor(private readonly userService:userService){
        super();
    }


    validate(email:string,password:string){
        console.log({email,password})
        const user= this.userService.getUserByPassword(email,password);
        if(!user){
            throw new UnauthorizedException();
        }
        if(user.password===password)return user
    }

}