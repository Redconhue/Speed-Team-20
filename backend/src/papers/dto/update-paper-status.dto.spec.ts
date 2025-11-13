import { validate } from 'class-validator';
import { UpdatePaperStatusDto } from './update-paper-status.dto';

describe('UpdatePaperStatusDto', () => {
  it('should validate a valid DTO', async () => {
    const dto = new UpdatePaperStatusDto();
    dto.reviewer = 'Reviewer Name';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when reviewer is empty', async () => {
    const dto = new UpdatePaperStatusDto();
    dto.reviewer = '';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isNotEmpty).toContain('审核者姓名不能为空');
  });
});