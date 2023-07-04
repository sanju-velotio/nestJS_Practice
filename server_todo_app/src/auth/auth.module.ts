import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportLocalStrategy } from './passport.local.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[UserModule],
  controllers: [AuthController],
  providers: [AuthService,PassportLocalStrategy]
})
export class AuthModule {}
