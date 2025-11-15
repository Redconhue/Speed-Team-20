import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PapersService } from './papers.service';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperStatusDto } from './dto/update-paper-status.dto';
import { Paper, PaperStatus } from './schemas/paper.schema';
import { memoryStorage } from 'multer';

@Controller('papers')
export class PapersController {
  constructor(private readonly papersService: PapersService) {}

  @Post()
  create(@Body() createPaperDto: CreatePaperDto): Promise<Paper> {
    return this.papersService.create(createPaperDto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('bibtexFile', {
      storage: memoryStorage(), // 使用内存存储
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(bib)$/)) {
          return callback(
            new BadRequestException('仅支持 .bib 格式文件'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadBibtex(
    @UploadedFile() file: Express.Multer.File,
    @Body('submitter') submitter: string,
  ): Promise<Paper> {
    if (!file) {
      throw new BadRequestException('文件不能为空');
    }
    if (!submitter) {
      throw new BadRequestException('提交者姓名不能为空');
    }

    const bibtexContent = file.buffer.toString('utf-8');
    const paperData = this.papersService.parseBibtexAndCreate(
      bibtexContent,
      submitter,
    );

    return this.papersService.create(paperData);
  }

  @Get()
  findAll(): Promise<Paper[]> {
    return this.papersService.findAll();
  }

  @Get('pending')
  findPending(): Promise<Paper[]> {
    return this.papersService.findAll(PaperStatus.PENDING);
  }

  @Put(':id/approve')
  approve(
    @Param('id') id: string,
    @Body() updateDto: UpdatePaperStatusDto,
  ): Promise<Paper> {
    return this.papersService.updateStatus(id, PaperStatus.APPROVED, updateDto);
  }

  @Put(':id/reject')
  reject(
    @Param('id') id: string,
    @Body() updateDto: UpdatePaperStatusDto,
  ): Promise<Paper> {
    return this.papersService.updateStatus(id, PaperStatus.REJECTED, updateDto);
  }
}
