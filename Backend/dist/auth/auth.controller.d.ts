import { AuthService } from './auth.service';
import { Response } from 'express';
import { RedisUser } from './jwt.strategy';
interface RequestWithUser extends Request {
    user: RedisUser;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: {
        first_name: string;
        last_name: string;
        age: number;
        username: string;
        email: string;
        password: string;
    }): Promise<any>;
    login(body: {
        username: string;
        password: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(req: Request): Promise<{
        message: string;
    }>;
    getProfile(req: RequestWithUser): Promise<RedisUser>;
}
export {};
