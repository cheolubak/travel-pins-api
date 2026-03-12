import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTravelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  region: string;

  @IsOptional()
  @IsUUID()
  groupId?: string;
}
