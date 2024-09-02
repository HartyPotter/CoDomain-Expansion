import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { TokenBlacklistService } from "./blacklist";
export declare class AuthGuard implements CanActivate {
    private jwtService;
    private reflector;
    private tokenBlacklistService;
    constructor(jwtService: JwtService, reflector: Reflector, tokenBlacklistService: TokenBlacklistService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
