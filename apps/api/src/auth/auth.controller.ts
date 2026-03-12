import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('kakao')
  loginWithKakao(@Body() dto: LoginDto) {
    return this.authService.loginWithKakao(dto);
  }

  @Post('naver')
  loginWithNaver(@Body() dto: LoginDto) {
    return this.authService.loginWithNaver(dto);
  }

  @Post('google')
  loginWithGoogle(@Body() dto: LoginDto) {
    return this.authService.loginWithGoogle(dto);
  }

  @Post('refresh')
  refreshToken(@Body() dto: RefreshDto) {
    return this.authService.refreshToken(dto);
  }
}
