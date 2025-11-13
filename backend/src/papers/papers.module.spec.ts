import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { PapersModule } from './papers.module';
import { PapersService } from './papers.service';
import { PapersController } from './papers.controller';

describe('PapersModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PapersModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide PapersService', () => {
    const service = module.get<PapersService>(PapersService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(PapersService);
  });

  it('should provide PapersController', () => {
    const controller = module.get<PapersController>(PapersController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(PapersController);
  });
});