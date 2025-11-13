import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
// 导入 PapersModule（确保路径和模块名完全匹配你的文件结构）
import { PapersModule } from './papers/papers.module';


@Module({
  // 导入依赖模块：数据库、文件上传、功能模块
  imports: [
    // 1. MongoDB 数据库连接配置
    // 本地 MongoDB 连接（默认端口 27017，数据库名 paper-review-system）
    // 若使用 MongoDB Atlas，替换为：MongooseModule.forRoot('mongodb+srv://<用户名>:<密码>@cluster0.mongodb.net/paper-review-system')
    MongooseModule.forRoot('mongodb+srv://speedteam20:speedteam20@group20.0ta7sls.mongodb.net/?appName=Group20'),
    
    // 2. 文件上传配置（临时存储目录 ./uploads）
    MulterModule.register({ dest: './uploads' }),
    
    // 3. 导入文献功能模块（核心业务模块）
    PapersModule,
  ],
  // 根模块无需声明控制器和服务（都在子模块中）
  controllers: [],
  providers: [],
})
export class AppModule {}