import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Paper, PaperStatus, PaperSchema } from './paper.schema';
import * as mongoose from 'mongoose';

describe('PaperSchema', () => {
  let paperModel: Model<Paper>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Paper.name),
          useValue: mongoose.model(Paper.name, PaperSchema),
        },
      ],
    }).compile();

    paperModel = module.get<Model<Paper>>(getModelToken(Paper.name));
  });

  it('should be defined', () => {
    expect(paperModel).toBeDefined();
  });

  it('should create a paper with required fields', () => {
    const paperData = {
      title: 'Test Paper',
      authors: 'Author1, Author2',
      doi: '10.1234/test.12345',
      submitter: 'Test User',
    };

    const paper = new paperModel(paperData);
    
    expect(paper.title).toBe(paperData.title);
    expect(paper.authors).toBe(paperData.authors);
    expect(paper.doi).toBe(paperData.doi);
    expect(paper.submitter).toBe(paperData.submitter);
    expect(paper.status).toBe(PaperStatus.PENDING);
    expect(paper.submittedAt).toBeDefined();
  });

  it('should trim string fields', () => {
    const paperData = {
      title: '  Test Paper  ',
      authors: '  Author1, Author2  ',
      doi: '  10.1234/test.12345  ',
      submitter: '  Test User  ',
    };

    const paper = new paperModel(paperData);
    
    expect(paper.title).toBe('Test Paper');
    expect(paper.authors).toBe('Author1, Author2');
    expect(paper.doi).toBe('10.1234/test.12345');
    expect(paper.submitter).toBe('Test User');
  });

  it('should handle optional fields', () => {
    const paperData = {
      title: 'Test Paper',
      authors: 'Author',
      doi: '10.1234/test.12345',
      submitter: 'Test User',
      abstract: 'Test abstract',
      journal: 'Test Journal',
      year: 2023,
    };

    const paper = new paperModel(paperData);
    
    expect(paper.abstract).toBe(paperData.abstract);
    expect(paper.journal).toBe(paperData.journal);
    expect(paper.year).toBe(paperData.year);
  });
});