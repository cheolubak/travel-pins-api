import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
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
    private readonly jwtService: JwtService,
  ) {}

  async findUserById(id: string) {
    return this.prismaService.users.findUnique({
      where: { id },
    });
  }

  async loginWithKakao({ accessToken, sessionId }: LoginDto) {
    const res = await this.httpService.axiosRef
      .get<KakaoUserDto>(`https://kapi.kakao.com/v2/user/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
      return this.generateToken(findUser.id, sessionId);
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

    return this.generateToken(user.id, sessionId);
  }

  async generateToken(userId: string, sessionId: string) {
    const payload = { sub: userId };
    const secret = this.configService.get('JWT_SECRET') + sessionId;
    const accessToken = await this.jwtService.signAsync(payload, { secret });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
      secret,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateTokenUser(token: string, sessionId: string) {
    const secret = this.configService.get('JWT_SECRET') + sessionId;

    const payload: { sub: string } = await this.jwtService.verifyAsync(token, {
      secret,
    });

    return await this.findUserById(payload.sub);
  }
}
