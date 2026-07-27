import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cors({
    origin: process.env.FRONTEND_URL || ['http://localhost:3001', 'https://opbattle.vercel.app'],
    credentials: true,
  }));
  
  // ⚠️ YEH LINE COMMENT KARO
  // app.setGlobalPrefix('api/v1');
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: false,
    disableErrorMessages: false,
  }));
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`⚡ OpBattle Backend running on port ${port}`);
}
bootstrap();
