import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@travel-pins/database';

@Injectable()
export class MyPlacesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMyPlaces(userId: string) {
    return this.prismaService.myPlaces.findMany({
      relationLoadStrategy: 'join',
      select: {
        createdAt: true,
        place: {
          select: {
            address: true,
            category: {
              select: {
                name: true,
              },
            },
            id: true,
            lat: true,
            lng: true,
            name: true,
            thumbnail: true,
            type: true,
          },
        },
      },
      where: { userId },
    });
  }

  async savePlace(userId: string, placeId: string) {
    const place = await this.prismaService.places.findUnique({
      where: { id: placeId },
    });

    if (!place) {
      throw new NotFoundException('Place not found');
    }

    const existing = await this.prismaService.myPlaces.findUnique({
      where: { placeId_userId: { placeId, userId } },
    });

    if (existing) {
      throw new ConflictException('Place already saved');
    }

    return this.prismaService.myPlaces.create({
      data: { placeId, userId },
    });
  }

  async unsavePlace(userId: string, placeId: string) {
    const existing = await this.prismaService.myPlaces.findUnique({
      where: { placeId_userId: { placeId, userId } },
    });

    if (!existing) {
      throw new NotFoundException('Saved place not found');
    }

    return this.prismaService.myPlaces.delete({
      where: { placeId_userId: { placeId, userId } },
    });
  }
}
