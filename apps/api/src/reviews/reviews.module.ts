import { Module } from '@nestjs/common';
import { DatabaseModule } from '@travel-pins/database';

import { AuthModule } from '../auth/auth.module';
import { ImageParseModule } from '../image-parse/image-parse.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  controllers: [ReviewsController],
  imports: [DatabaseModule, AuthModule, ImageParseModule],
  providers: [ReviewsService],
})
export class ReviewsModule {}
