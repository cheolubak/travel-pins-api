import { IsOptional, IsString } from 'class-validator';

export class UpdateTravelDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  region?: string;
}
