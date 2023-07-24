import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { UserInterCeptor } from './User/interceptor/user.interceptors';



async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.useGlobalInterceptors(new UserInterCeptor());
  app.use
  await app.listen(3001);
}
bootstrap();
