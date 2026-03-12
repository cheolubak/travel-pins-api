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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@travel-pins/database");
const uuid_1 = require("uuid");
const image_parse_service_1 = require("../image-parse/image-parse.service");
let UsersService = class UsersService {
    constructor(prismaService, imageParseService) {
        this.prismaService = prismaService;
        this.imageParseService = imageParseService;
    }
    async getUser(id) {
        const user = await this.prismaService.users.findUnique({
            select: {
                createdAt: true,
                id: true,
                nickname: true,
                profile: true,
                socialType: true,
            },
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateUser(id, dto) {
        if (dto.nickname) {
            const existing = await this.prismaService.users.findUnique({
                where: { nickname: dto.nickname },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('Nickname already taken');
            }
        }
        let profilePath;
        if (dto.profile) {
            profilePath = await this.imageParseService.uploadImageAsWebp(dto.profile, `users/${(0, uuid_1.v4)()}`);
        }
        return this.prismaService.users.update({
            data: {
                ...(dto.nickname && { nickname: dto.nickname }),
                ...(profilePath && { profile: profilePath }),
            },
            select: {
                id: true,
                nickname: true,
                profile: true,
                updatedAt: true,
            },
            where: { id },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        image_parse_service_1.ImageParseService])
], UsersService);
//# sourceMappingURL=users.service.js.map