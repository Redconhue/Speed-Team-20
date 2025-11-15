import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { PapersService } from './papers.service';
import { PapersController } from './papers.controller';
import { Paper, PaperSchema } from './schemas/paper.schema';

// 关键：必须加 export 关键字
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Paper.name, schema: PaperSchema }]),
    MulterModule.register(),
  ],
  controllers: [PapersController],
  providers: [PapersService],
})
export class PapersModule {}
