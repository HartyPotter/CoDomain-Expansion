import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): any;
}
