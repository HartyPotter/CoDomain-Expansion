import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
export declare class AuthService {
    private userService;
    private jwtService;
    private Redis;
    constructor(userService: UsersService, jwtService: JwtService, Redis: RedisService);
    private generateAcessToken;
    validateCredentials(username: string, input_password: string): Promise<any>;
    signUp(first_name: string, last_name: string, age: number, username: string, email: string, password: string): Promise<any>;
    login(username: string, password: string): Promise<{
        accessToken: string;
    }>;
    logout(req: any): Promise<void>;
}
