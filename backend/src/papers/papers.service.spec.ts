import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PapersService } from './papers.service';
import { Paper, PaperStatus } from './schemas/paper.schema';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperStatusDto } from './dto/update-paper-status.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockPaper = {
  _id: '123',
  title: 'Test Paper',
  authors: 'Author1, Author2',
  doi: '10.1234/test.12345',
  submitter: 'Test User',
  status: PaperStatus.PENDING,
  submittedAt: new Date(),
  save: jest.fn().mockResolvedValue(this),
};

const mockPaperModel = {
  findOne: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  prototype: {
    save: jest.fn(),
  },
};

describe('PapersService', () => {
  let service: PapersService;
  let model: Model<Paper>;

  beforeEach(async () => {
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
    model = module.get<Model<Paper>>(getModelToken(Paper.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new paper', async () => {
      const createPaperDto: CreatePaperDto = {
        title: 'Test Paper',
        authors: 'Author1, Author2',
        doi: '10.1234/test.12345',
        submitter: 'Test User',
      };

      mockPaperModel.findOne.mockResolvedValue(null);
      const saveMock = jest.fn().mockResolvedValue(mockPaper);
      mockPaperModel.prototype.save = saveMock;

      // Mock the constructor to return our mock object
      const mockConstructor = jest.fn().mockImplementation(() => ({
        ...mockPaper,
        ...createPaperDto,
        submittedAt: expect.any(Date),
        save: saveMock,
      }));
      (model as any) = mockConstructor;

      const result = await service.create(createPaperDto);

      expect(mockPaperModel.findOne).toHaveBeenCalledWith({
        doi: createPaperDto.doi,
      });
      expect(result).toEqual(mockPaper);
    });

    it('should throw ConflictException for duplicate DOI', async () => {
      const createPaperDto: CreatePaperDto = {
        title: 'Test Paper',
        authors: 'Author1, Author2',
        doi: '10.1234/test.12345',
        submitter: 'Test User',
      };

      mockPaperModel.findOne.mockResolvedValue(mockPaper);

      await expect(service.create(createPaperDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('parseBibtexAndCreate', () => {
    it('should parse valid BibTeX content', () => {
      const bibtexContent = `
        @article{test2023,
          title = {Test Paper Title},
          author = {Author1 and Author2},
          doi = {10.1234/test.12345},
          journal = {Test Journal},
          year = {2023},
          abstract = {This is a test abstract}
        }
      `;

      const submitter = 'Test User';
      const result = service.parseBibtexAndCreate(bibtexContent, submitter);

      expect(result).toEqual({
        title: 'Test Paper Title',
        authors: 'Author1 and Author2',
        doi: '10.1234/test.12345',
        journal: 'Test Journal',
        year: 2023,
        abstract: 'This is a test abstract',
        submitter: 'Test User',
      });
    });

    it('should throw error for missing required fields', () => {
      const bibtexContent = `
        @article{test2023,
          journal = {Test Journal},
          year = {2023}
        }
      `;

      const submitter = 'Test User';

      expect(() => {
        service.parseBibtexAndCreate(bibtexContent, submitter);
      }).toThrow('BibTeX文件缺少必要字段（标题、作者、DOI）');
    });
  });

  describe('findAll', () => {
    it('should return all papers when no status provided', async () => {
      const papers = [mockPaper];
      mockPaperModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(papers),
        }),
      });

      const result = await service.findAll();

      expect(mockPaperModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual(papers);
    });

    it('should return papers with specific status', async () => {
      const papers = [mockPaper];
      mockPaperModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(papers),
        }),
      });

      const result = await service.findAll(PaperStatus.PENDING);

      expect(mockPaperModel.find).toHaveBeenCalledWith({
        status: PaperStatus.PENDING,
      });
      expect(result).toEqual(papers);
    });
  });

  describe('updateStatus', () => {
    it('should update paper status', async () => {
      const updateDto: UpdatePaperStatusDto = { reviewer: 'Reviewer' };
      const updatedPaper = {
        ...mockPaper,
        status: PaperStatus.APPROVED,
        reviewer: 'Reviewer',
        reviewedAt: expect.any(Date),
      };

      mockPaperModel.findById.mockResolvedValue(mockPaper);
      mockPaperModel.findByIdAndUpdate.mockResolvedValue(updatedPaper);

      const result = await service.updateStatus(
        '123',
        PaperStatus.APPROVED,
        updateDto,
      );

      expect(mockPaperModel.findById).toHaveBeenCalledWith('123');
      expect(mockPaperModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        {
          status: PaperStatus.APPROVED,
          reviewer: updateDto.reviewer,
          reviewedAt: expect.any(Date),
        },
        { new: true, runValidators: true },
      );
      expect(result).toEqual(updatedPaper);
    });

    it('should throw NotFoundException when paper not found', async () => {
      mockPaperModel.findById.mockResolvedValue(null);

      await expect(
        service.updateStatus('123', PaperStatus.APPROVED, {
          reviewer: 'Reviewer',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});