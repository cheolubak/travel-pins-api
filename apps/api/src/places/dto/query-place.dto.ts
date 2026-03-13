import { Transform } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class QueryPlaceDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  rightTopLat: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  rightTopLng: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  leftBottomLat: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  leftBottomLng: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;
}
