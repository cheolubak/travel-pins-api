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
exports.TravelsService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@travel-pins/database");
let TravelsService = class TravelsService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async createTravel(userId, dto) {
        if (dto.groupId) {
            await this.validateGroupMembership(userId, dto.groupId);
        }
        return this.prismaService.travels.create({
            data: {
                groupId: dto.groupId || null,
                name: dto.name,
                region: dto.region,
            },
        });
    }
    async getTravels(userId, query) {
        if (query.groupId) {
            await this.validateGroupMembership(userId, query.groupId);
        }
        return this.prismaService.travels.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                createdAt: true,
                group: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                id: true,
                name: true,
                region: true,
            },
            where: {
                deleted: false,
                ...(query.groupId && { groupId: query.groupId }),
            },
        });
    }
    async getTravel(userId, id) {
        const travel = await this.prismaService.travels.findFirst({
            select: {
                createdAt: true,
                group: {
                    select: {
                        id: true,
                        members: {
                            select: {
                                user: {
                                    select: {
                                        id: true,
                                        nickname: true,
                                        profile: true,
                                    },
                                },
                            },
                        },
                        name: true,
                    },
                },
                id: true,
                name: true,
                region: true,
                updatedAt: true,
            },
            where: { deleted: false, id },
        });
        if (!travel) {
            throw new common_1.NotFoundException('Travel not found');
        }
        if (travel.group) {
            await this.validateGroupMembership(userId, travel.group.id);
        }
        return travel;
    }
    async updateTravel(userId, id, dto) {
        const travel = await this.prismaService.travels.findFirst({
            where: { deleted: false, id },
        });
        if (!travel) {
            throw new common_1.NotFoundException('Travel not found');
        }
        if (travel.groupId) {
            await this.validateGroupMembership(userId, travel.groupId);
        }
        return this.prismaService.travels.update({
            data: {
                ...(dto.name && { name: dto.name }),
                ...(dto.region && { region: dto.region }),
            },
            where: { id },
        });
    }
    async deleteTravel(userId, id) {
        const travel = await this.prismaService.travels.findFirst({
            where: { deleted: false, id },
        });
        if (!travel) {
            throw new common_1.NotFoundException('Travel not found');
        }
        if (travel.groupId) {
            await this.validateGroupMembership(userId, travel.groupId);
        }
        return this.prismaService.travels.update({
            data: { deleted: true },
            where: { id },
        });
    }
    async validateGroupMembership(userId, groupId) {
        const membership = await this.prismaService.groupMembers.findUnique({
            where: { groupId_userId: { groupId, userId } },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('Not a member of this group');
        }
    }
};
exports.TravelsService = TravelsService;
exports.TravelsService = TravelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], TravelsService);
//# sourceMappingURL=travels.service.js.map