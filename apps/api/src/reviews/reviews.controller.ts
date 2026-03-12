import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { RequiredAuthGuard } from '../auth/required-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  getReviews(@Query() query: QueryReviewDto) {
    return this.reviewsService.getReviews(query);
  }

  @Get(':id')
  getReview(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.getReview(id);
  }

  @Post()
  @UseGuards(RequiredAuthGuard)
  createReview(@Request() req, @Body() dto: CreateReviewDto) {
    return this.reviewsService.createReview(req.user.id, dto);
  }

  @Patch(':id')
  @UseGuards(RequiredAuthGuard)
  updateReview(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(req.user.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(RequiredAuthGuard)
  deleteReview(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.deleteReview(req.user.id, id);
  }
}
