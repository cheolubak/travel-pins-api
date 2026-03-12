import { PrismaService } from '@travel-pins/database';
import { ImageParseService } from '../image-parse/image-parse.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prismaService;
    private readonly imageParseService;
    constructor(prismaService: PrismaService, imageParseService: ImageParseService);
    getUser(id: string): Promise<{
        id: string;
        nickname: string;
        profile: string;
        createdAt: Date;
        socialType: import("@travel-pins/database/dist/generated/prisma").$Enums.SocialType;
    }>;
    updateUser(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        nickname: string;
        profile: string;
        updatedAt: Date;
    }>;
}
