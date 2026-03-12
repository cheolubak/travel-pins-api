import { IsOptional, IsString } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;
}
