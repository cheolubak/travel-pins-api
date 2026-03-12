import { AddMemberDto } from './dto/add-member.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupsService } from './groups.service';
export declare class GroupsController {
    private readonly groupsService;
    constructor(groupsService: GroupsService);
    createGroup(req: any, dto: CreateGroupDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
    }>;
    getMyGroups(req: any): Promise<{
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
    getGroup(req: any, id: string): Promise<{
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
    updateGroup(req: any, id: string, dto: UpdateGroupDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
    }>;
    deleteGroup(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
    }>;
    addMember(req: any, id: string, dto: AddMemberDto): Promise<{
        createdAt: Date;
        userId: string;
        groupId: string;
    }>;
    removeMember(req: any, id: string, userId: string): Promise<{
        createdAt: Date;
        userId: string;
        groupId: string;
    }>;
}
