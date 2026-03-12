import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@travel-pins/database";
import { v4 as uuidv4 } from "uuid";

import { ImageParseService } from "../image-parse/image-parse.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { QueryReviewDto } from "./dto/query-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly imageParseService: ImageParseService,
  ) {}

  async getReviews(query: QueryReviewDto) {
    return this.prismaService.reviews.findMany({
      orderBy: { createdAt: 'desc' },
      relationLoadStrategy: 'join',
      select: {
        content: true,
        createdAt: true,
        id: true,
        images: {
          select: {
            id: true,
            pathname: true,
          },
          where: { deleted: false },
        },
        title: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            nickname: true,
            profile: true,
          },
        },
      },
      where: {
        deleted: false,
        placeId: query.placeId,
      },
    });
  }

  async getReview(id: string) {
    const review = await this.prismaService.reviews.findFirst({
      relationLoadStrategy: 'join',
      select: {
        content: true,
        createdAt: true,
        id: true,
        images: {
          select: {
            id: true,
            pathname: true,
          },
          where: { deleted: false },
        },
        place: {
          select: {
            id: true,
            name: true,
          },
        },
        title: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            nickname: true,
            profile: true,
          },
        },
      },
      where: { deleted: false, id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async createReview(userId: string, dto: CreateReviewDto) {
    const place = await this.prismaService.places.findUnique({
      where: { id: dto.placeId },
    });

    if (!place) {
      throw new NotFoundException('Place not found');
    }

    const review = await this.prismaService.reviews.create({
      data: {
        content: dto.content,
        placeId: dto.placeId,
        title: dto.title,
        userId,
      },
    });

    if (dto.imageUrls?.length) {
      const imagePromises = dto.imageUrls.map(async (url) => {
        const pathname = await this.imageParseService.uploadImageAsWebp(
          url,
          `reviews/${uuidv4()}`,
        );

        return this.prismaService.reviewImages.create({
          data: {
            pathname,
            reviewId: review.id,
          },
        });
      });

      await Promise.all(imagePromises);
    }

    return this.getReview(review.id);
  }

  async updateReview(userId: string, id: string, dto: UpdateReviewDto) {
    const review = await this.prismaService.reviews.findFirst({
      where: { deleted: false, id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('Not your review');
    }

    return this.prismaService.reviews.update({
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.content && { content: dto.content }),
      },
      where: { id },
    });
  }

  async deleteReview(userId: string, id: string) {
    const review = await this.prismaService.reviews.findFirst({
      where: { deleted: false, id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('Not your review');
    }

    return this.prismaService.reviews.update({
      data: { deleted: true },
      where: { id },
    });
  }
}
