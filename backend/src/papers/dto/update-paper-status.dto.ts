import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePaperStatusDto {
  @IsString()
  @IsNotEmpty({ message: '审核者姓名不能为空' })
  reviewer: string;
}