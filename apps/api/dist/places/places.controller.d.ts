import { QueryPlaceDto } from './dto/query-place.dto';
import { RegisterPlaceDto } from './dto/register-place.dto';
import { PlacesService } from './places.service';
export declare class PlacesController {
    private readonly placeService;
    constructor(placeService: PlacesService);
    getPlaces(query: QueryPlaceDto): Promise<{
        id: string;
        name: string;
        address: string;
        detailAddress: string;
        postcode: string;
        thumbnail: string;
        type: import("@travel-pins/database/dist/generated/prisma").$Enums.PlaceType;
        lat: number;
        lng: number;
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
        thumbnail: string | null;
        type: import("@travel-pins/database/dist/generated/prisma").$Enums.PlaceType;
        lat: number;
        lng: number;
        categoryId: number | null;
    }>;
}
