import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@travel-pins/database';

import { AddMemberDto } from './dto/add-member.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createGroup(userId: string, dto: CreateGroupDto) {
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

  async getMyGroups(userId: string) {
    return this.prismaService.groups.findMany({
      relationLoadStrategy: 'join',
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

  async getGroup(userId: string, id: string) {
    await this.validateMembership(userId, id);

    return this.prismaService.groups.findUnique({
      relationLoadStrategy: 'join',
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

  async updateGroup(userId: string, id: string, dto: UpdateGroupDto) {
    await this.validateMembership(userId, id);

    return this.prismaService.groups.update({
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description && { description: dto.description }),
      },
      where: { id },
    });
  }

  async deleteGroup(userId: string, id: string) {
    await this.validateMembership(userId, id);

    await this.prismaService.groupMembers.deleteMany({
      where: { groupId: id },
    });

    return this.prismaService.groups.delete({
      where: { id },
    });
  }

  async addMember(userId: string, groupId: string, dto: AddMemberDto) {
    await this.validateMembership(userId, groupId);

    const user = await this.prismaService.users.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prismaService.groupMembers.create({
      data: {
        groupId,
        userId: dto.userId,
      },
    });
  }

  async removeMember(
    requesterId: string,
    groupId: string,
    targetUserId: string,
  ) {
    await this.validateMembership(requesterId, groupId);

    const targetMember = await this.prismaService.groupMembers.findUnique({
      where: { groupId_userId: { groupId, userId: targetUserId } },
    });

    if (!targetMember) {
      throw new NotFoundException('Member not found');
    }

    return this.prismaService.groupMembers.delete({
      where: { groupId_userId: { groupId, userId: targetUserId } },
    });
  }

  private async validateMembership(userId: string, groupId: string) {
    const membership = await this.prismaService.groupMembers.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });

    if (!membership) {
      throw new ForbiddenException('Not a member of this group');
    }

    return membership;
  }
}
