import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@travel-pins/database';
import { ImageParseService } from '../image-parse/image-parse.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly httpService;
    private readonly prismaService;
    private readonly imageParseService;
    private readonly configService;
    private readonly jwtService;
    constructor(httpService: HttpService, prismaService: PrismaService, imageParseService: ImageParseService, configService: ConfigService, jwtService: JwtService);
    findUserById(id: string): Promise<{
        id: string;
        nickname: string;
        socialId: string;
        profile: string | null;
        createdAt: Date;
        updatedAt: Date;
        socialType: import("@travel-pins/database/dist/generated/prisma").$Enums.SocialType;
    }>;
    loginWithKakao({ accessToken, sessionId }: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    generateToken(userId: string, sessionId: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    validateTokenUser(token: string, sessionId: string): Promise<{
        id: string;
        nickname: string;
        socialId: string;
        profile: string | null;
        createdAt: Date;
        updatedAt: Date;
        socialType: import("@travel-pins/database/dist/generated/prisma").$Enums.SocialType;
    }>;
}
