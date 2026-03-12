"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const database_1 = require("@travel-pins/database");
const uuid_1 = require("uuid");
const image_parse_service_1 = require("../image-parse/image-parse.service");
let AuthService = class AuthService {
    constructor(httpService, prismaService, imageParseService, configService, jwtService) {
        this.httpService = httpService;
        this.prismaService = prismaService;
        this.imageParseService = imageParseService;
        this.configService = configService;
        this.jwtService = jwtService;
    }
    async findUserById(id) {
        return this.prismaService.users.findUnique({
            where: { id },
        });
    }
    async loginWithKakao({ accessToken, sessionId }) {
        const res = await this.httpService.axiosRef
            .get(`https://kapi.kakao.com/v2/user/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            params: {
                property_keys: [
                    'kakao_account.email',
                    'kakao_account.name',
                    'kakao_account.profile',
                ],
                secure_resource: true,
            },
        })
            .then((res) => res.data);
        const findUser = await this.prismaService.users.findUnique({
            where: {
                socialId: res.id.toString(),
                socialType: 'KAKAO',
            },
        });
        if (findUser) {
            return this.generateToken(findUser.id, sessionId);
        }
        const profile = res.kakao_account.profile.thumbnail_image_url
            ? await this.imageParseService.uploadImageAsWebp(res.kakao_account.profile.thumbnail_image_url, `users/${(0, uuid_1.v4)()}`)
            : null;
        const user = await this.prismaService.users.create({
            data: {
                nickname: res.kakao_account.profile.nickname,
                profile,
                socialId: res.id.toString(),
                socialType: 'KAKAO',
            },
        });
        return this.generateToken(user.id, sessionId);
    }
    async loginWithNaver({ accessToken, sessionId }) {
        const res = await this.httpService.axiosRef
            .get(`https://openapi.naver.com/v1/nid/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => res.data);
        const findUser = await this.prismaService.users.findUnique({
            where: {
                socialId: res.response.id,
                socialType: 'NAVER',
            },
        });
        if (findUser) {
            return this.generateToken(findUser.id, sessionId);
        }
        const profile = res.response.profile_image
            ? await this.imageParseService.uploadImageAsWebp(res.response.profile_image, `users/${(0, uuid_1.v4)()}`)
            : null;
        const user = await this.prismaService.users.create({
            data: {
                nickname: res.response.nickname || res.response.name || res.response.id,
                profile,
                socialId: res.response.id,
                socialType: 'NAVER',
            },
        });
        return this.generateToken(user.id, sessionId);
    }
    async loginWithGoogle({ accessToken, sessionId }) {
        const res = await this.httpService.axiosRef
            .get(`https://www.googleapis.com/oauth2/v2/userinfo`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => res.data);
        const findUser = await this.prismaService.users.findUnique({
            where: {
                socialId: res.id,
                socialType: 'GOOGLE',
            },
        });
        if (findUser) {
            return this.generateToken(findUser.id, sessionId);
        }
        const profile = res.picture
            ? await this.imageParseService.uploadImageAsWebp(res.picture, `users/${(0, uuid_1.v4)()}`)
            : null;
        const user = await this.prismaService.users.create({
            data: {
                nickname: res.name || res.email || res.id,
                profile,
                socialId: res.id,
                socialType: 'GOOGLE',
            },
        });
        return this.generateToken(user.id, sessionId);
    }
    async generateToken(userId, sessionId) {
        const payload = { sub: userId };
        const secret = this.configService.get('JWT_SECRET') + sessionId;
        const accessToken = await this.jwtService.signAsync(payload, { secret });
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '30d',
            secret,
        });
        return {
            accessToken,
            refreshToken,
        };
    }
    async refreshToken({ refreshToken, sessionId }) {
        try {
            const secret = this.configService.get('JWT_SECRET') + sessionId;
            const payload = await this.jwtService.verifyAsync(refreshToken, { secret });
            return this.generateToken(payload.sub, sessionId);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async validateTokenUser(token, sessionId) {
        const secret = this.configService.get('JWT_SECRET') + sessionId;
        const payload = await this.jwtService.verifyAsync(token, {
            secret,
        });
        return await this.findUserById(payload.sub);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        database_1.PrismaService,
        image_parse_service_1.ImageParseService,
        config_1.ConfigService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map