import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../database/prisma.service';
import { ImageParseService } from '../image-parse/image-parse.service';
import { RegisterPlaceDto } from './dto/register-place.dto';

@Injectable()
export class PlacesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly imageParseService: ImageParseService,
  ) {}

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
        detailAddress,
        lat,
        lng,
        name,
        postcode,
        thumbnail: placeThumbnail,
        type,
      },
    });

    await this.prismaService.placeCategory.create({
      data: {
        categoryId: category.id,
        placeId: place.id,
      },
    });

    return place;
  }
}
