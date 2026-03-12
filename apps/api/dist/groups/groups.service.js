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
exports.GroupsService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@travel-pins/database");
let GroupsService = class GroupsService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async createGroup(userId, dto) {
        const group = await this.prismaService.groups.create({
            data: {
                description: dto.description,
                name: dto.name,
            },
        });
        await this.prismaService.groupMembers.create({
            data: {
                groupId: group.id,
                userId,
            },
        });
        return group;
    }
    async getMyGroups(userId) {
        return this.prismaService.groups.findMany({
            select: {
                createdAt: true,
                description: true,
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
            where: {
                members: {
                    some: { userId },
                },
            },
        });
    }
    async getGroup(userId, id) {
        await this.validateMembership(userId, id);
        return this.prismaService.groups.findUnique({
            select: {
                createdAt: true,
                description: true,
                id: true,
                members: {
                    select: {
                        createdAt: true,
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
                travels: {
                    select: {
                        id: true,
                        name: true,
                        region: true,
                    },
                    where: { deleted: false },
                },
            },
            where: { id },
        });
    }
    async updateGroup(userId, id, dto) {
        await this.validateMembership(userId, id);
        return this.prismaService.groups.update({
            data: {
                ...(dto.name && { name: dto.name }),
                ...(dto.description && { description: dto.description }),
            },
            where: { id },
        });
    }
    async deleteGroup(userId, id) {
        await this.validateMembership(userId, id);
        await this.prismaService.groupMembers.deleteMany({
            where: { groupId: id },
        });
        return this.prismaService.groups.delete({
            where: { id },
        });
    }
    async addMember(userId, groupId, dto) {
        await this.validateMembership(userId, groupId);
        const user = await this.prismaService.users.findUnique({
            where: { id: dto.userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.prismaService.groupMembers.create({
            data: {
                groupId,
                userId: dto.userId,
            },
        });
    }
    async removeMember(requesterId, groupId, targetUserId) {
        await this.validateMembership(requesterId, groupId);
        const targetMember = await this.prismaService.groupMembers.findUnique({
            where: { groupId_userId: { groupId, userId: targetUserId } },
        });
        if (!targetMember) {
            throw new common_1.NotFoundException('Member not found');
        }
        return this.prismaService.groupMembers.delete({
            where: { groupId_userId: { groupId, userId: targetUserId } },
        });
    }
    async validateMembership(userId, groupId) {
        const membership = await this.prismaService.groupMembers.findUnique({
            where: { groupId_userId: { groupId, userId } },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('Not a member of this group');
        }
        return membership;
    }
};
exports.GroupsService = GroupsService;
exports.GroupsService = GroupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], GroupsService);
//# sourceMappingURL=groups.service.js.map