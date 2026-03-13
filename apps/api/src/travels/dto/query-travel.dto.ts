import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class QueryTravelDto {
  @IsOptional()
  @IsUUID()
  groupId?: string;

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
