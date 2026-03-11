import { PlaceType } from '@travel-pins/database';
export declare class RegisterPlaceDto {
    name: string;
    address: string;
    detailAddress?: string;
    postcode: string;
    lat: number;
    lng: number;
    thumbnail?: string;
    type: PlaceType;
    categoryId: number;
}
