import { IsOptional, IsUUID } from 'class-validator';

export class QueryTravelDto {
  @IsOptional()
  @IsUUID()
  groupId?: string;
}
