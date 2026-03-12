import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@travel-pins/database';

import { CreateTravelDto } from './dto/create-travel.dto';
import { QueryTravelDto } from './dto/query-travel.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';

@Injectable()
export class TravelsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createTravel(userId: string, dto: CreateTravelDto) {
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

  async getTravels(userId: string, query: QueryTravelDto) {
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

  async getTravel(userId: string, id: string) {
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
      throw new NotFoundException('Travel not found');
    }

    if (travel.group) {
      await this.validateGroupMembership(userId, travel.group.id);
    }

    return travel;
  }

  async updateTravel(userId: string, id: string, dto: UpdateTravelDto) {
    const travel = await this.prismaService.travels.findFirst({
      where: { deleted: false, id },
    });

    if (!travel) {
      throw new NotFoundException('Travel not found');
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

  async deleteTravel(userId: string, id: string) {
    const travel = await this.prismaService.travels.findFirst({
      where: { deleted: false, id },
    });

    if (!travel) {
      throw new NotFoundException('Travel not found');
    }

    if (travel.groupId) {
      await this.validateGroupMembership(userId, travel.groupId);
    }

    return this.prismaService.travels.update({
      data: { deleted: true },
      where: { id },
    });
  }

  private async validateGroupMembership(userId: string, groupId: string) {
    const membership = await this.prismaService.groupMembers.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });

    if (!membership) {
      throw new ForbiddenException('Not a member of this group');
    }
  }
}
