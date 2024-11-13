import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
export declare class AuthService {
    private userService;
    private jwtService;
    private Redis;
    constructor(userService: UsersService, jwtService: JwtService, Redis: RedisService);
    private generateAcessToken;
    validateCredentials(loginUserDto: any): Promise<any>;
    register(registerUserDto: RegisterUserDto): Promise<any>;
    login(loginUserDto: LoginUserDto): Promise<{
        user: any;
        accessToken: string;
    }>;
    logout(token: any): Promise<void>;
}
