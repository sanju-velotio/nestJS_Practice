import { Global, MiddlewareConsumer, Module,NestModule, RequestMethod } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserMiddleware } from "src/middleware/User.middleware";


@Global()  // make this current module as global module and also use anywhere without importing this
@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})

export class UserModule implements NestModule {
    configure(consumer:MiddlewareConsumer) {
        consumer
        .apply(UserMiddleware)
        .forRoutes("user")
    }
}