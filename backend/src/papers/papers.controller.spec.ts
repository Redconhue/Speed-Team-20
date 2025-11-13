import { Test, TestingModule } from '@nestjs/testing';
import { PapersController } from './papers.controller';
import { PapersService } from './papers.service';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperStatusDto } from './dto/update-paper-status.dto';
import { Paper, PaperStatus } from './schemas/paper.schema';
import { BadRequestException } from '@nestjs/common';

const mockPaper: Paper = {
  _id: '123',
  title: 'Test Paper',
  authors: 'Author1, Author2',
  doi: '10.1234/test.12345',
  submitter: 'Test User',
  status: PaperStatus.PENDING,
  submittedAt: new Date(),
} as Paper;

const mockPapersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  updateStatus: jest.fn(),
  parseBibtexAndCreate: jest.fn(),
};

describe('PapersController', () => {
  let controller: PapersController;
  let service: PapersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PapersController],
      providers: [
        {
          provide: PapersService,
          useValue: mockPapersService,
        },
      ],
    }).compile();

    controller = module.get<PapersController>(PapersController);
    service = module.get<PapersService>(PapersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a paper', async () => {
      const createPaperDto: CreatePaperDto = {
        title: 'Test Paper',
        authors: 'Author1, Author2',
        doi: '10.1234/test.12345',
        submitter: 'Test User',
      };

      mockPapersService.create.mockResolvedValue(mockPaper);

      const result = await controller.create(createPaperDto);

      expect(service.create).toHaveBeenCalledWith(createPaperDto);
      expect(result).toEqual(mockPaper);
    });
  });

  describe('findAll', () => {
    it('should return all papers', async () => {
      const papers = [mockPaper];
      mockPapersService.findAll.mockResolvedValue(papers);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(papers);
    });
  });

  describe('findPending', () => {
    it('should return pending papers', async () => {
      const papers = [mockPaper];
      mockPapersService.findAll.mockResolvedValue(papers);

      const result = await controller.findPending();

      expect(service.findAll).toHaveBeenCalledWith(PaperStatus.PENDING);
      expect(result).toEqual(papers);
    });
  });

  describe('approve', () => {
    it('should approve a paper', async () => {
      const updateDto: UpdatePaperStatusDto = { reviewer: 'Reviewer' };
      const approvedPaper = { ...mockPaper, status: PaperStatus.APPROVED };
      
      mockPapersService.updateStatus.mockResolvedValue(approvedPaper);

      const result = await controller.approve('123', updateDto);

      expect(service.updateStatus).toHaveBeenCalledWith(
        '123',
        PaperStatus.APPROVED,
        updateDto,
      );
      expect(result).toEqual(approvedPaper);
    });
  });

  describe('reject', () => {
    it('should reject a paper', async () => {
      const updateDto: UpdatePaperStatusDto = { reviewer: 'Reviewer' };
      const rejectedPaper = { ...mockPaper, status: PaperStatus.REJECTED };
      
      mockPapersService.updateStatus.mockResolvedValue(rejectedPaper);

      const result = await controller.reject('123', updateDto);

      expect(service.updateStatus).toHaveBeenCalledWith(
        '123',
        PaperStatus.REJECTED,
        updateDto,
      );
      expect(result).toEqual(rejectedPaper);
    });
  });
});