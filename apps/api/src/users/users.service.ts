import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@travel-pins/database';
import { v4 as uuidv4 } from 'uuid';

import { ImageParseService } from '../image-parse/image-parse.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly imageParseService: ImageParseService,
  ) {}

  async getUser(id: string) {
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
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    if (dto.nickname) {
      const existing = await this.prismaService.users.findUnique({
        where: { nickname: dto.nickname },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Nickname already taken');
      }
    }

    let profilePath: string | undefined;

    if (dto.profile) {
      profilePath = await this.imageParseService.uploadImageAsWebp(
        dto.profile,
        `users/${uuidv4()}`,
      );
    }

    return this.prismaService.users.update({
      data: {
        ...(dto.nickname !== undefined && { nickname: dto.nickname }),
        ...(profilePath !== undefined && { profile: profilePath }),
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
}
