import { QueryPlaceDto } from './dto/query-place.dto';
import { RegisterPlaceDto } from './dto/register-place.dto';
import { PlacesService } from './places.service';
export declare class PlacesController {
    private readonly placeService;
    constructor(placeService: PlacesService);
    getPlaces(req: any, query: QueryPlaceDto): Promise<{
        id: string;
        name: string;
        address: string;
        detailAddress: string;
        postcode: string;
        lat: number;
        lng: number;
        thumbnail: string;
        type: import("@travel-pins/database/dist/generated/prisma").$Enums.PlaceType;
        category: {
            name: string;
        };
    }[]>;
    registerPlaces(dto: RegisterPlaceDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        address: string;
        detailAddress: string | null;
        postcode: string;
        lat: number;
        lng: number;
        thumbnail: string | null;
        type: import("@travel-pins/database/dist/generated/prisma").$Enums.PlaceType;
        categoryId: number | null;
    }>;
}
