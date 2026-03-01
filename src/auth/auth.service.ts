import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../database/prisma.service';
import { ImageParseService } from '../image-parse/image-parse.service';
import { KakaoUserDto } from './dto/kakao-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
    private readonly imageParseService: ImageParseService,
    private readonly configService: ConfigService,
  ) {}

  async loginWithKakao(dto: LoginDto) {
    const res = await this.httpService.axiosRef
      .get<KakaoUserDto>(`https://kapi.kakao.com/v2/user/me`, {
        headers: {
          Authorization: `Bearer ${dto.accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        params: {
          property_keys: [
            'kakao_account.email',
            'kakao_account.name',
            'kakao_account.profile',
          ],
          secure_resource: true,
        },
      })
      .then((res) => res.data);

    const findUser = await this.prismaService.users.findUnique({
      where: {
        socialId: res.id.toString(),
        socialType: 'KAKAO',
      },
    });

    if (findUser) {
      return findUser;
    }

    const profile = res.kakao_account.profile.thumbnail_image_url
      ? await this.imageParseService.uploadImageAsWebp(
          res.kakao_account.profile.thumbnail_image_url,
          `users/${uuidv4()}`,
        )
      : null;

    const user = await this.prismaService.users.create({
      data: {
        nickname: res.kakao_account.profile.nickname,
        profile,
        socialId: res.id.toString(),
        socialType: 'KAKAO',
      },
    });

    return user;
  }
}
