import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@travel-pins/database';

import { AddTravelPlaceDto } from './dto/add-travel-place.dto';
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
        userId,
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
      skip: query.offset,
      take: query.limit,
      where: {
        deleted: false,
        ...(query.groupId ? { groupId: query.groupId } : { userId }),
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
        places: {
          orderBy: { sortOrder: 'asc' },
          select: {
            createdAt: true,
            memo: true,
            place: {
              select: {
                address: true,
                id: true,
                lat: true,
                lng: true,
                name: true,
                thumbnail: true,
                type: true,
              },
            },
            sortOrder: true,
          },
        },
        region: true,
        updatedAt: true,
        userId: true,
      },
      where: { deleted: false, id },
    });

    if (!travel) {
      throw new NotFoundException('Travel not found');
    }

    if (travel.group) {
      await this.validateGroupMembership(userId, travel.group.id);
    } else if (travel.userId !== userId) {
      throw new ForbiddenException('Not the owner of this travel');
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

    await this.validateTravelAccess(userId, travel);

    return this.prismaService.travels.update({
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.region !== undefined && { region: dto.region }),
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

    await this.validateTravelAccess(userId, travel);

    return this.prismaService.travels.update({
      data: { deleted: true },
      where: { id },
    });
  }

  async addPlace(userId: string, travelId: string, dto: AddTravelPlaceDto) {
    const travel = await this.prismaService.travels.findFirst({
      where: { deleted: false, id: travelId },
    });

    if (!travel) {
      throw new NotFoundException('Travel not found');
    }

    await this.validateTravelAccess(userId, travel);

    const place = await this.prismaService.places.findUnique({
      where: { id: dto.placeId },
    });

    if (!place) {
      throw new NotFoundException('Place not found');
    }

    const existing = await this.prismaService.travelPlaces.findUnique({
      where: { travelId_placeId: { placeId: dto.placeId, travelId } },
    });

    if (existing) {
      throw new ConflictException('Place already added to this travel');
    }

    return this.prismaService.travelPlaces.create({
      data: {
        memo: dto.memo,
        placeId: dto.placeId,
        sortOrder: dto.sortOrder ?? 0,
        travelId,
      },
      select: {
        createdAt: true,
        memo: true,
        place: {
          select: {
            address: true,
            id: true,
            lat: true,
            lng: true,
            name: true,
            thumbnail: true,
            type: true,
          },
        },
        sortOrder: true,
      },
    });
  }

  async removePlace(userId: string, travelId: string, placeId: string) {
    const travel = await this.prismaService.travels.findFirst({
      where: { deleted: false, id: travelId },
    });

    if (!travel) {
      throw new NotFoundException('Travel not found');
    }

    await this.validateTravelAccess(userId, travel);

    const travelPlace = await this.prismaService.travelPlaces.findUnique({
      where: { travelId_placeId: { placeId, travelId } },
    });

    if (!travelPlace) {
      throw new NotFoundException('Place not found in this travel');
    }

    return this.prismaService.travelPlaces.delete({
      where: { travelId_placeId: { placeId, travelId } },
    });
  }

  private async validateTravelAccess(
    userId: string,
    travel: { groupId: string | null; userId: string },
  ) {
    if (travel.groupId) {
      await this.validateGroupMembership(userId, travel.groupId);
    } else if (travel.userId !== userId) {
      throw new ForbiddenException('Not the owner of this travel');
    }
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
