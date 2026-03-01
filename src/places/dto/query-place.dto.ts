import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

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
}
