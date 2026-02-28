import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class QueryPlaceDto {
  @Type(() => Number)
  @IsNumber()
  leftTopLat: number;

  @Type(() => Number)
  @IsNumber()
  leftTopLng: number;

  @Type(() => Number)
  @IsNumber()
  rightBottomLat: number;

  @Type(() => Number)
  @IsNumber()
  rightBottomLng: number;
}
