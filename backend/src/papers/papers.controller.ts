import { Controller, Post, Get, Body, Param, Put, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PapersService } from './papers.service';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperStatusDto } from './dto/update-paper-status.dto';
import { Paper, PaperStatus } from './schemas/paper.schema';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
          callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(bib)$/)) {
          return callback(new BadRequestException('仅支持 .bib 格式文件'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadBibtex(
    @UploadedFile() file: Express.Multer.File,
    @Body('submitter') submitter: string,
  ): Promise<Paper> {
    if (!submitter) {
      throw new BadRequestException('提交者姓名不能为空');
    }
    const bibtexContent = file.buffer.toString('utf-8');
    
    // 修复：移除 await，因为 parseBibtexAndCreate 现在是同步方法
    const paperData = this.papersService.parseBibtexAndCreate(bibtexContent, submitter);
    
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