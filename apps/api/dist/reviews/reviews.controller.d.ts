import { CreateReviewDto } from './dto/create-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    getReviews(query: QueryReviewDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        user: {
            id: string;
            nickname: string;
            profile: string;
        };
        title: string;
        content: string;
        images: {
            id: string;
            pathname: string;
        }[];
    }[]>;
    getReview(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        user: {
            id: string;
            nickname: string;
            profile: string;
        };
        place: {
            id: string;
            name: string;
        };
        title: string;
        content: string;
        images: {
            id: string;
            pathname: string;
        }[];
    }>;
    createReview(req: any, dto: CreateReviewDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        user: {
            id: string;
            nickname: string;
            profile: string;
        };
        place: {
            id: string;
            name: string;
        };
        title: string;
        content: string;
        images: {
            id: string;
            pathname: string;
        }[];
    }>;
    updateReview(req: any, id: string, dto: UpdateReviewDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        deleted: boolean;
        placeId: string;
        title: string;
        content: string;
    }>;
    deleteReview(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        deleted: boolean;
        placeId: string;
        title: string;
        content: string;
    }>;
}
