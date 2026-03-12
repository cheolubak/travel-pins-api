import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    loginWithKakao(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    loginWithNaver(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    loginWithGoogle(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(dto: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
