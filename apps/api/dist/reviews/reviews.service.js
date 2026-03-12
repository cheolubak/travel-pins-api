"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@travel-pins/database");
const uuid_1 = require("uuid");
const image_parse_service_1 = require("../image-parse/image-parse.service");
let ReviewsService = class ReviewsService {
    constructor(prismaService, imageParseService) {
        this.prismaService = prismaService;
        this.imageParseService = imageParseService;
    }
    async getReviews(query) {
        return this.prismaService.reviews.findMany({
            orderBy: { createdAt: 'desc' },
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
    async getReview(id) {
        const review = await this.prismaService.reviews.findFirst({
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
            throw new common_1.NotFoundException('Review not found');
        }
        return review;
    }
    async createReview(userId, dto) {
        const place = await this.prismaService.places.findUnique({
            where: { id: dto.placeId },
        });
        if (!place) {
            throw new common_1.NotFoundException('Place not found');
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
                const pathname = await this.imageParseService.uploadImageAsWebp(url, `reviews/${(0, uuid_1.v4)()}`);
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
    async updateReview(userId, id, dto) {
        const review = await this.prismaService.reviews.findFirst({
            where: { deleted: false, id },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.userId !== userId) {
            throw new common_1.ForbiddenException('Not your review');
        }
        return this.prismaService.reviews.update({
            data: {
                ...(dto.title && { title: dto.title }),
                ...(dto.content && { content: dto.content }),
            },
            where: { id },
        });
    }
    async deleteReview(userId, id) {
        const review = await this.prismaService.reviews.findFirst({
            where: { deleted: false, id },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.userId !== userId) {
            throw new common_1.ForbiddenException('Not your review');
        }
        return this.prismaService.reviews.update({
            data: { deleted: true },
            where: { id },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        image_parse_service_1.ImageParseService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map