import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UsersService, jwtService: JwtService);
    login(username: string, password: string): Promise<UnauthorizedException | {
        accessToken: string;
    }>;
    signUp(username: string, email: string, password: string): Promise<any>;
}
