import { MyPlacesService } from './my-places.service';
export declare class MyPlacesController {
    private readonly myPlacesService;
    constructor(myPlacesService: MyPlacesService);
    getMyPlaces(req: any): Promise<{
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
    savePlace(req: any, placeId: string): Promise<{
        createdAt: Date;
        placeId: string;
        userId: string;
    }>;
    unsavePlace(req: any, placeId: string): Promise<{
        createdAt: Date;
        placeId: string;
        userId: string;
    }>;
}
