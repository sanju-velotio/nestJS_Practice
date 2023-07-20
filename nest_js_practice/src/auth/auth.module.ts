import { Module } from "@nestjs/common"
import { AuthController } from "./auth.controller";
import { AuthService } from './auth.service';
import { AccessTokenStratgy } from "./strategies/access_token.strategies";
import { RefreshTokenStratgy } from "./strategies/refress_token.strategies";
import { JwtModule } from '@nestjs/jwt';
@Module({
    imports: [
        JwtModule.register({
            secret: "secret_token",
            signOptions: { expiresIn: '60s' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AccessTokenStratgy, RefreshTokenStratgy],
    exports: []
})

export class AuthModule { }