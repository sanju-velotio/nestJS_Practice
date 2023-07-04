import { Module } from "@nestjs/common"
import { AuthController } from "./auth.controller";
import { UserModule } from "src/User/user.module";

@Module({
    imports: [UserModule],
    controllers: [AuthController],
    providers: []
})

export class AuthModule { }