import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@travel-pins/database';
import { v4 as uuidv4 } from 'uuid';

import { ImageParseService } from '../image-parse/image-parse.service';
import { GoogleUserDto } from './dto/google-user.dto';
import { KakaoUserDto } from './dto/kakao-user.dto';
import { LoginDto } from './dto/login.dto';
import { NaverUserDto } from './dto/naver-user.dto';
import { RefreshDto } from './dto/refresh.dto';

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

  private async generateUniqueNickname(baseNickname: string): Promise<string> {
    const trimmed = baseNickname.slice(0, 16);

    const existing = await this.prismaService.users.findUnique({
      where: { nickname: trimmed },
    });

    if (!existing) {
      return trimmed;
    }

    for (let i = 1; i <= 100; i++) {
      const candidate = `${trimmed}_${i}`;
      const found = await this.prismaService.users.findUnique({
        where: { nickname: candidate },
      });
      if (!found) {
        return candidate;
      }
    }

    return `${trimmed}_${Date.now()}`;
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

    const findUser = await this.prismaService.users.findFirst({
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

    const nickname = await this.generateUniqueNickname(
      res.kakao_account.profile.nickname,
    );

    const user = await this.prismaService.users.create({
      data: {
        nickname,
        profile,
        socialId: res.id.toString(),
        socialType: 'KAKAO',
      },
    });

    return this.generateToken(user.id, sessionId);
  }

  async loginWithNaver({ accessToken, sessionId }: LoginDto) {
    const res = await this.httpService.axiosRef
      .get<NaverUserDto>(`https://openapi.naver.com/v1/nid/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data);

    const findUser = await this.prismaService.users.findFirst({
      where: {
        socialId: res.response.id,
        socialType: 'NAVER',
      },
    });

    if (findUser) {
      return this.generateToken(findUser.id, sessionId);
    }

    const profile = res.response.profile_image
      ? await this.imageParseService.uploadImageAsWebp(
          res.response.profile_image,
          `users/${uuidv4()}`,
        )
      : null;

    const nickname = await this.generateUniqueNickname(
      res.response.nickname || res.response.name || res.response.id,
    );

    const user = await this.prismaService.users.create({
      data: {
        nickname,
        profile,
        socialId: res.response.id,
        socialType: 'NAVER',
      },
    });

    return this.generateToken(user.id, sessionId);
  }

  async loginWithGoogle({ accessToken, sessionId }: LoginDto) {
    const res = await this.httpService.axiosRef
      .get<GoogleUserDto>(`https://www.googleapis.com/oauth2/v2/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data);

    const findUser = await this.prismaService.users.findFirst({
      where: {
        socialId: res.id,
        socialType: 'GOOGLE',
      },
    });

    if (findUser) {
      return this.generateToken(findUser.id, sessionId);
    }

    const profile = res.picture
      ? await this.imageParseService.uploadImageAsWebp(
          res.picture,
          `users/${uuidv4()}`,
        )
      : null;

    const nickname = await this.generateUniqueNickname(
      res.name || res.email || res.id,
    );

    const user = await this.prismaService.users.create({
      data: {
        nickname,
        profile,
        socialId: res.id,
        socialType: 'GOOGLE',
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

  async refreshToken({ refreshToken, sessionId }: RefreshDto) {
    try {
      const secret = this.configService.get('JWT_SECRET') + sessionId;
      const payload: { sub: string } = await this.jwtService.verifyAsync(
        refreshToken,
        { secret },
      );

      return this.generateToken(payload.sub, sessionId);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateTokenUser(token: string, sessionId: string) {
    const secret = this.configService.get('JWT_SECRET') + sessionId;

    const payload: { sub: string } = await this.jwtService.verifyAsync(token, {
      secret,
    });

    return await this.findUserById(payload.sub);
  }
}
