import { IsInt, IsNotEmpty, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class QueryReviewDto {
  @IsNotEmpty()
  @IsUUID()
  placeId: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
