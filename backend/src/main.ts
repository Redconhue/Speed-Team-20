import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 修复 CORS 配置
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  });

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  await app.listen(3001);
  console.log(`Backend running on http://localhost:3001`);
}

// 修复 Promise 处理
bootstrap().catch((err) => {
  console.error('Bootstrap error:', err);
  process.exit(1);
});
