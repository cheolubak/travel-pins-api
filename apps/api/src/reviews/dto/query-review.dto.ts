import { IsNotEmpty, IsUUID } from 'class-validator';

export class QueryReviewDto {
  @IsNotEmpty()
  @IsUUID()
  placeId: string;
}
