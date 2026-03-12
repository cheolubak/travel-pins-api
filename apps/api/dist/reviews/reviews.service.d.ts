import { PrismaService } from "@travel-pins/database";
import { ImageParseService } from "../image-parse/image-parse.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { QueryReviewDto } from "./dto/query-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
export declare class ReviewsService {
    private readonly prismaService;
    private readonly imageParseService;
    constructor(prismaService: PrismaService, imageParseService: ImageParseService);
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
    createReview(userId: string, dto: CreateReviewDto): Promise<{
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
    updateReview(userId: string, id: string, dto: UpdateReviewDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        deleted: boolean;
        placeId: string;
        title: string;
        content: string;
    }>;
    deleteReview(userId: string, id: string): Promise<{
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
