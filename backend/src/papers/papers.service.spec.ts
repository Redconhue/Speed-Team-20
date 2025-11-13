import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PapersService } from './papers.service';
import { Paper } from './schemas/paper.schema';
import { CreatePaperDto } from './dto/create-paper.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('PapersService', () => {
  let service: PapersService;
  let mockPaperModel: any;

  beforeEach(async () => {
    mockPaperModel = {
      findOne: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      prototype: {
        save: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PapersService,
        {
          provide: getModelToken(Paper.name),
          useValue: mockPaperModel,
        },
      ],
    }).compile();

    service = module.get<PapersService>(PapersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parseBibtexAndCreate', () => {
    it('should parse valid bibtex content', () => {
      const bibtexContent = `
        @article{test2023,
          title = {Test Paper},
          author = {John Doe},
          doi = {10.1234/test.2023},
          journal = {Test Journal},
          year = {2023},
          abstract = {This is a test abstract}
        }
      `;

      const result = service.parseBibtexAndCreate(bibtexContent, 'test@example.com');

      expect(result.title).toBe('Test Paper');
      expect(result.authors).toBe('John Doe');
      expect(result.doi).toBe('10.1234/test.2023');
      expect(result.submitter).toBe('test@example.com');
    });

    it('should throw error for missing required fields', () => {
      const invalidBibtex = `
        @article{test2023,
          journal = {Test Journal}
        }
      `;

      expect(() => {
        service.parseBibtexAndCreate(invalidBibtex, 'test@example.com');
      }).toThrow('BibTeX文件缺少必要字段（标题、作者、DOI）');
    });
  });
});