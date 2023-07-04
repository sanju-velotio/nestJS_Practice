import { Module } from "@nestjs/common";
import { userService } from "./user.service";



@Module({
    imports:[],
    controllers:[],
    providers: [userService],
    exports:[userService]
})
export class UserModule {

}
