import { PrismaService } from '@travel-pins/database';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
export declare class GroupsService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    createGroup(userId: string, dto: CreateGroupDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
    }>;
    getMyGroups(userId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string;
        members: {
            user: {
                id: string;
                nickname: string;
                profile: string;
            };
        }[];
    }[]>;
    getGroup(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string;
        members: {
            createdAt: Date;
            user: {
                id: string;
                nickname: string;
                profile: string;
            };
        }[];
        travels: {
            id: string;
            name: string;
            region: string;
        }[];
    }>;
    updateGroup(userId: string, id: string, dto: UpdateGroupDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
    }>;
    deleteGroup(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
    }>;
    addMember(userId: string, groupId: string, dto: AddMemberDto): Promise<{
        createdAt: Date;
        userId: string;
        groupId: string;
    }>;
    removeMember(requesterId: string, groupId: string, targetUserId: string): Promise<{
        createdAt: Date;
        userId: string;
        groupId: string;
    }>;
    private validateMembership;
}
