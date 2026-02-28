import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../database/prisma.service';
import { ImageParseService } from '../image-parse/image-parse.service';
import { QueryPlaceDto } from './dto/query-place.dto';
import { RegisterPlaceDto } from './dto/register-place.dto';

@Injectable()
export class PlacesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly imageParseService: ImageParseService,
  ) {}

  async getPlaces(query: QueryPlaceDto) {
    const { leftTopLat, leftTopLng, rightBottomLat, rightBottomLng } = query;

    return this.prismaService.places.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      where: {
        lat: {
          gte: rightBottomLat,
          lte: leftTopLat,
        },
        lng: {
          gte: leftTopLng,
          lte: rightBottomLng,
        },
      },
    });
  }

  async registerPlaces(dto: RegisterPlaceDto) {
    const {
      address,
      categoryId,
      detailAddress,
      lat,
      lng,
      name,
      postcode,
      thumbnail,
      type,
    } = dto;

    const category = await this.prismaService.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new BadRequestException();
    }

    const placeThumbnail = thumbnail
      ? await this.imageParseService.uploadImageAsWebp(
          thumbnail,
          `places/${uuidv4()}`,
        )
      : null;

    const place = await this.prismaService.places.create({
      data: {
        address,
        categoryId: category.id,
        detailAddress,
        lat,
        lng,
        name,
        postcode,
        thumbnail: placeThumbnail,
        type,
      },
    });

    return place;
  }
}
