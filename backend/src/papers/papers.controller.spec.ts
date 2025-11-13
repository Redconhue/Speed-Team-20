import { Test, TestingModule } from '@nestjs/testing';
import { PapersController } from './papers.controller';
import { PapersService } from './papers.service';
import { CreatePaperDto } from './dto/create-paper.dto';
import { PaperStatus } from './schemas/paper.schema';

describe('PapersController', () => {
  let controller: PapersController;
  let service: PapersService;

  const mockPaper = {
    id: '1',
    title: 'Test Paper',
    authors: 'John Doe',
    doi: '10.1234/test.2023',
    status: PaperStatus.PENDING,
    submittedAt: new Date(),
  };

  const mockPapersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    updateStatus: jest.fn(),
    parseBibtexAndCreate: jest.fn(),
  };

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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of papers', async () => {
      const result = [mockPaper];
      mockPapersService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });
});