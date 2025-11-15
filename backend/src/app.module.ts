import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
// 导入原项目的其他模块（如文献模块等）
 import { PapersModule } from './papers/papers.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb+srv://speedteam20:speedteam20@group20.0ta7sls.mongodb.net/?appName=Group20'), // MongoDB连接
    AuthModule,
    UsersModule,
    PapersModule, // 保留原项目模块
  ],
})
export class AppModule {}