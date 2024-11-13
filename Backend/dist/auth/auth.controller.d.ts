import { AuthService } from './auth.service';
import { Response } from 'express';
import { RequestWithUser } from './jwt.strategy';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
interface requestWithUser extends Request {
    user: RequestWithUser;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerUserDto: RegisterUserDto): Promise<{
        message: string;
    }>;
    login(loginUserDto: LoginUserDto, res: Response): Promise<any>;
    logout(req: Request, res: Response): Promise<{
        message: string;
    }>;
    getProfile(req: requestWithUser): Promise<RequestWithUser>;
}
export {};
