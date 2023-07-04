import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { UserModule } from "./User/user.module";
import { AppDataSource } from "./db/postgress.config";
import { AuthModule } from "./auth/auth.module";



AppDataSource.initialize()
    .then((result) => {
        console.log("successfull connect")
    })

    .catch((err) => {
        console.log("error on not connect", err)
    })
@Module({
    imports: [UserModule,AuthModule],
    controllers: [AppController],
    providers: []
})
export class AppModule { }