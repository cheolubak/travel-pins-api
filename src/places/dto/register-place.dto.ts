import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { PlaceType } from '../../database/generated/prisma';

export class RegisterPlaceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  detailAddress?: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 5)
  postcode: string;

  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  lng: number;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsEnum(PlaceType)
  type: PlaceType;

  @IsInt()
  categoryId: number;
}
