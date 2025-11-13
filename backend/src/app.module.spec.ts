import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { PapersModule } from './papers/papers.module';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should import MongooseModule', () => {
    const mongooseModule = module.get(MongooseModule);
    expect(mongooseModule).toBeDefined();
  });

  it('should import MulterModule', () => {
    const multerModule = module.get(MulterModule);
    expect(multerModule).toBeDefined();
  });

  it('should import PapersModule', () => {
    const papersModule = module.get(PapersModule);
    expect(papersModule).toBeDefined();
  });
});