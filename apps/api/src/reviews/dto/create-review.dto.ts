import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsUUID()
  placeId: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  imageUrls?: string[];
}
