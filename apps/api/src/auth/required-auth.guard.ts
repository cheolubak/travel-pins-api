import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from './auth.service';

@Injectable()
export class RequiredAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization, sessionid } = request.headers;

    if (!authorization || !sessionid) {
      throw new UnauthorizedException();
    }

    const accessToken = authorization.split(' ').at(1);

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.authService.validateTokenUser(
        accessToken,
        sessionid,
      );

      if (!user) {
        throw new UnauthorizedException();
      }

      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
