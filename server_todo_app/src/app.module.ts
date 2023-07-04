import { Module } from "@nestjs/common"
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';



// Inside Module() decorators we use some metadata
@Module({
    imports: [AuthModule, UserModule],
    controllers: [AppController],
    providers: [AppService]
})

export class AppModule { } // make nestJs module to use Module() decorators