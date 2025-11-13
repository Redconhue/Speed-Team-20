import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// 删掉所有和 cors 相关的导入（包括 import * as cors from 'cors'）

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 直接调用 NestJS 内置的 enableCors 方法（无需导入任何额外模块）
  app.enableCors({
    origin: '*', // 开发环境允许所有跨域
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  });

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  await app.listen(3001);
  console.log(`Backend running on http://localhost:3001`);
}
bootstrap();