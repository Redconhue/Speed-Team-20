import { validate } from 'class-validator';
import { CreatePaperDto } from './create-paper.dto';

describe('CreatePaperDto', () => {
  it('should validate a valid DTO', async () => {
    const dto = new CreatePaperDto();
    dto.title = 'Test Paper Title';
    dto.authors = 'Author1, Author2';
    dto.doi = '10.1234/example.12345';
    dto.submitter = 'Test User';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when required fields are empty', async () => {
    const dto = new CreatePaperDto();
    dto.title = '';
    dto.authors = '';
    dto.doi = '';
    dto.submitter = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    
    const errorMessages = errors.map(error => error.constraints?.isNotEmpty);
    expect(errorMessages).toContain('标题不能为空');
    expect(errorMessages).toContain('作者不能为空');
    expect(errorMessages).toContain('DOI不能为空');
    expect(errorMessages).toContain('提交者姓名不能为空');
  });

  it('should fail with invalid DOI format', async () => {
    const dto = new CreatePaperDto();
    dto.title = 'Test Paper';
    dto.authors = 'Author';
    dto.doi = 'invalid-doi-format';
    dto.submitter = 'Test User';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.matches).toContain('DOI格式无效');
  });

  it('should validate optional fields correctly', async () => {
    const dto = new CreatePaperDto();
    dto.title = 'Test Paper';
    dto.authors = 'Author';
    dto.doi = '10.1234/example.12345';
    dto.submitter = 'Test User';
    dto.abstract = 'This is an abstract';
    dto.journal = 'Test Journal';
    dto.year = 2023;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with invalid year', async () => {
    const dto = new CreatePaperDto();
    dto.title = 'Test Paper';
    dto.authors = 'Author';
    dto.doi = '10.1234/example.12345';
    dto.submitter = 'Test User';
    dto.year = 1800; // Too early

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.min).toContain('年份不能早于1900');
  });
});