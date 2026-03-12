import { PrismaService } from '@travel-pins/database';
import { CreateTravelDto } from './dto/create-travel.dto';
import { QueryTravelDto } from './dto/query-travel.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';
export declare class TravelsService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    createTravel(userId: string, dto: CreateTravelDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        groupId: string | null;
        region: string;
        deleted: boolean;
    }>;
    getTravels(userId: string, query: QueryTravelDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        group: {
            id: string;
            name: string;
        };
        region: string;
    }[]>;
    getTravel(userId: string, id: string): Promise<{
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
    updateTravel(userId: string, id: string, dto: UpdateTravelDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        groupId: string | null;
        region: string;
        deleted: boolean;
    }>;
    deleteTravel(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        groupId: string | null;
        region: string;
        deleted: boolean;
    }>;
    private validateGroupMembership;
}
