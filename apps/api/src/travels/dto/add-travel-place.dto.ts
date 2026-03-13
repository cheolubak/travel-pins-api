import { IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class AddTravelPlaceDto {
  @IsUUID()
  placeId: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number = 0;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  memo?: string;
}
