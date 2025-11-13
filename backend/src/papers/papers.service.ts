import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Paper, PaperStatus } from './schemas/paper.schema';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperStatusDto } from './dto/update-paper-status.dto';

// 关键：必须加 export 关键字
@Injectable()
export class PapersService {
  constructor(@InjectModel(Paper.name) private paperModel: Model<Paper>) {}

  async create(createPaperDto: CreatePaperDto): Promise<Paper> {
    const existingPaper = await this.paperModel.findOne({ doi: createPaperDto.doi }).exec();
    if (existingPaper) {
      throw new ConflictException('该DOI已提交过');
    }
    const createdPaper = new this.paperModel({ ...createPaperDto, submittedAt: new Date() });
    return createdPaper.save();
  }

  async parseBibtexAndCreate(bibtexContent: string, submitter: string): Promise<CreatePaperDto> {
    const parsedData: any = { submitter };
    const bibtexRegex = {
      title: /title\s*=\s*["{](.*?)["}]/i,
      authors: /author\s*=\s*["{](.*?)["}]/i,
      doi: /doi\s*=\s*["{](.*?)["}]/i,
      journal: /journal\s*=\s*["{](.*?)["}]/i,
      year: /year\s*=\s*["{](\d{4})["}]/i,
      abstract: /abstract\s*=\s*["{](.*?)["}]/i,
    };
    for (const [key, regex] of Object.entries(bibtexRegex)) {
      const match = bibtexContent.match(regex);
      if (match && match[1]) {
        parsedData[key] = key === 'year' ? parseInt(match[1]) : match[1].trim();
      }
    }
    if (!parsedData.title || !parsedData.authors || !parsedData.doi) {
      throw new Error('BibTeX文件缺少必要字段（标题、作者、DOI）');
    }
    return parsedData as CreatePaperDto;
  }

  async findAll(status?: PaperStatus): Promise<Paper[]> {
    const query = status ? { status } : {};
    return this.paperModel.find(query).sort({ submittedAt: -1 }).exec();
  }

  async updateStatus(
    id: string,
    status: PaperStatus,
    dto: UpdatePaperStatusDto,
  ): Promise<Paper> {
  const paper = await this.paperModel.findById(id).exec();
  if (!paper) throw new NotFoundException('文献不存在');

  // 关键修复：添加类型断言 + 空值判断
  const updatedPaper = await this.paperModel.findByIdAndUpdate(
    id,
    { status, reviewer: dto.reviewer, reviewedAt: new Date() },
    { new: true, runValidators: true } // new: true 返回更新后的文档
  ).exec() as Paper; // 类型断言为 Paper（因已提前校验 paper 存在，不会返回 null）

  // 双重保障：若仍为 null，抛出异常（理论上不会触发）
  if (!updatedPaper) throw new NotFoundException('文献更新失败');
  
  return updatedPaper;
}
}