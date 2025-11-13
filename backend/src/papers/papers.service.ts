import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Paper, PaperStatus } from './schemas/paper.schema';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperStatusDto } from './dto/update-paper-status.dto';

// 定义 BibTeX 解析结果的接口
interface ParsedBibtexData {
  title?: string;
  authors?: string;
  doi?: string;
  journal?: string;
  year?: number;
  abstract?: string;
  submitter: string;
}

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

  parseBibtexAndCreate(bibtexContent: string, submitter: string): CreatePaperDto {
    const parsedData: ParsedBibtexData = { submitter };
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
        const typedKey = key as keyof Omit<ParsedBibtexData, 'submitter'>;
        if (typedKey === 'year') {
          parsedData[typedKey] = parseInt(match[1]);
        } else {
          // 修复：使用更安全的类型转换
          const stringValue = match[1].trim();
          // 根据键名进行安全赋值
          switch (typedKey) {
            case 'title':
              parsedData.title = stringValue;
              break;
            case 'authors':
              parsedData.authors = stringValue;
              break;
            case 'doi':
              parsedData.doi = stringValue;
              break;
            case 'journal':
              parsedData.journal = stringValue;
              break;
            case 'abstract':
              parsedData.abstract = stringValue;
              break;
          }
        }
      }
    }

    if (!parsedData.title || !parsedData.authors || !parsedData.doi) {
      throw new Error('BibTeX文件缺少必要字段（标题、作者、DOI）');
    }

    // 返回 CreatePaperDto，确保所有字段都存在
    return {
      title: parsedData.title,
      authors: parsedData.authors,
      doi: parsedData.doi,
      journal: parsedData.journal,
      year: parsedData.year,
      abstract: parsedData.abstract,
      submitter: parsedData.submitter,
    };
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

    const updatedPaper = await this.paperModel.findByIdAndUpdate(
      id,
      { status, reviewer: dto.reviewer, reviewedAt: new Date() },
      { new: true, runValidators: true }
    ).exec();

    if (!updatedPaper) throw new NotFoundException('文献更新失败');
    
    return updatedPaper;
  }
}