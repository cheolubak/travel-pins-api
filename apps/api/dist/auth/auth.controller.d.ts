import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    loginWithKakao(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
