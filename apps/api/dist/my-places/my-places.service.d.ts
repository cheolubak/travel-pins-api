import { PrismaService } from '@travel-pins/database';
export declare class MyPlacesService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    getMyPlaces(userId: string): Promise<{
        createdAt: Date;
        place: {
            id: string;
            name: string;
            address: string;
            thumbnail: string;
            type: import("@travel-pins/database/dist/generated/prisma").$Enums.PlaceType;
            lat: number;
            lng: number;
            category: {
                name: string;
            };
        };
    }[]>;
    savePlace(userId: string, placeId: string): Promise<{
        createdAt: Date;
        placeId: string;
        userId: string;
    }>;
    unsavePlace(userId: string, placeId: string): Promise<{
        createdAt: Date;
        placeId: string;
        userId: string;
    }>;
}
