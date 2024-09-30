import { Controller, Get, Post, Body, Request, HttpCode, HttpStatus, Req, Res, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator'
import { Response } from 'express';
import { RequestWithUser } from './jwt.strategy'; // Import the RedisUser type
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';


interface requestWithUser extends Request {
  user: RequestWithUser;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    try {
      const user = await this.authService.register(registerUserDto);
    
      if (!user) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT)
      }
      console.log("User created successfully")
      
      return { message: "User created successfully" };
    
    } catch (error) {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    
    try {
      const { user, accessToken } = await this.authService.login(loginUserDto);

      if (!user || !accessToken) {
        throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      res.cookie("accessToken", accessToken, {
        httpOnly: true,     // Prevent access to the cookie from JavaScript
        secure: false,       // Send the cookie over HTTPS only
        sameSite: "lax",  // Prevent CSRF attacks
        maxAge: 24 * 60 * 60 * 1000,
        path: "/"
      });

      // const userFlattened = {
      //   id: user.id,
      //   first_name: user.first_name,
      //   last_name: user.last_name,
      //   age: user.age,
      //   username: user.username,
      //   email: user.email
      // }
      // res.send("Logged in successfully");
      return user;
    }
    catch (error) {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.headers['cookie'].split('=')[1]

	  try {

      await this.authService.logout(token);
      res.clearCookie("accessToken");
      
      return {message: "Logged out successfuly"};
    } catch (error) {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('profile')
  async getProfile(@Req() req: requestWithUser) {
    return req.user;
  }

}
