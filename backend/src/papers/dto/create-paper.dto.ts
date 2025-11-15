import {
  IsString,
  IsNotEmpty,
  Matches,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreatePaperDto {
  @IsString()
  @IsNotEmpty({ message: '标题不能为空' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '作者不能为空' })
  authors: string;

  @IsString()
  @IsNotEmpty({ message: 'DOI不能为空' })
  @Matches(/^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i, {
    message: 'DOI格式无效（示例：10.1038/nature12345）',
  })
  doi: string;

  @IsOptional()
  @IsString()
  abstract?: string;

  @IsOptional()
  @IsString()
  journal?: string;

  @IsOptional()
  @IsInt({ message: '年份必须是整数' })
  @Min(1900, { message: '年份不能早于1900' })
  @Max(new Date().getFullYear(), { message: '年份不能晚于当前年份' })
  year?: number;

  @IsString()
  @IsNotEmpty({ message: '提交者姓名不能为空' })
  submitter: string;
}
