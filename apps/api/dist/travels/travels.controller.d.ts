import { CreateTravelDto } from './dto/create-travel.dto';
import { QueryTravelDto } from './dto/query-travel.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';
import { TravelsService } from './travels.service';
export declare class TravelsController {
    private readonly travelsService;
    constructor(travelsService: TravelsService);
    createTravel(req: any, dto: CreateTravelDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        groupId: string | null;
        region: string;
        deleted: boolean;
    }>;
    getTravels(req: any, query: QueryTravelDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        group: {
            id: string;
            name: string;
        };
        region: string;
    }[]>;
    getTravel(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        group: {
            id: string;
            name: string;
            members: {
                user: {
                    id: string;
                    nickname: string;
                    profile: string;
                };
            }[];
        };
        region: string;
    }>;
    updateTravel(req: any, id: string, dto: UpdateTravelDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        groupId: string | null;
        region: string;
        deleted: boolean;
    }>;
    deleteTravel(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        groupId: string | null;
        region: string;
        deleted: boolean;
    }>;
}
