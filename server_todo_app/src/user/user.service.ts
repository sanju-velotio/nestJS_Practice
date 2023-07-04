import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/Entities/user.entity";


@Injectable()
export class userService {

    public users: UserEntity[] = [
        {
            email: "abc@gmail.com",
            password: "secreat123"
        },
        {
            email: "yash@gmail.com",
            password: "123@/"
        }
    ]

    getUserByPassword(email:string,password:string):UserEntity{
        console.log({email,password})
        return this.users.find((user)=>user.email===email)
    }
}