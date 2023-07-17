import { Global, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";


@Global()  // make this current module as global module and also use anywhere without importing this
@Module({
    imports:[],
    controllers:[UserController],
    providers:[UserService],
    exports:[UserService]
})
export class UserModule {}