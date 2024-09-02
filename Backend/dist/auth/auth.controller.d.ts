import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenBlacklistService } from "./blacklist";
export declare class AuthController {
    private authService;
    private tokenBlacklistService;
    constructor(authService: AuthService, tokenBlacklistService: TokenBlacklistService);
    login(body: {
        username: string;
        password: string;
    }): Promise<UnauthorizedException | {
        accessToken: string;
    }>;
    register(body: {
        username: string;
        email: string;
        password: string;
    }): Promise<any>;
    logout(req: any): Promise<{
        message: string;
    }>;
    getProfile(req: any): any;
}
