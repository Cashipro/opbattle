import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cors());
  
  // ⚠️ SAB KUCH HATADO — koi prefix, koi validation nahi
  // app.setGlobalPrefix('api/v1');
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`⚡ Server running on port ${port}`);
  console.log(`📍 Test URL: http://localhost:${port}/test`);
}
bootstrap();
