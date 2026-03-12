import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: any): Promise<{
        id: string;
        nickname: string;
        profile: string;
        createdAt: Date;
        socialType: import("@travel-pins/database/dist/generated/prisma").$Enums.SocialType;
    }>;
    updateMe(req: any, dto: UpdateUserDto): Promise<{
        id: string;
        nickname: string;
        profile: string;
        updatedAt: Date;
    }>;
}
