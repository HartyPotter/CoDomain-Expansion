import { Controller, Get, Post, Body, Request, HttpCode, HttpStatus, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator'
import { Response } from 'express';
import { RedisUser } from './jwt.strategy'; // Import the RedisUser type


interface RequestWithUser extends Request {
  user: RedisUser;
}
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
      async register(@Body() body: { first_name: string, last_name: string, age: number, username: string, email: string, password: string }) {
      const { 
        first_name,
        last_name,
        age,
        username,
        email,
        password,
      } = body;
      return this.authService.signUp(first_name, last_name, age, username, email, password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: { username: string, password: string }, @Res() res: Response) {
    const { username, password } = body;
    
    const accessToken = await this.authService.login(username, password);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    })

    return res.send({ message: 'Logged in successfully' });
  }
  

  @Post('logout')
  async logout(@Req() req: Request) {
      await this.authService.logout(req);
	    return { message: "Logged out successfully" };
  }

  @Get('profile')
  async getProfile(@Req() req: RequestWithUser) {
    const user = req.user;
    return user;
  }

}
