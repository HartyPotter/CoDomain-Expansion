import {
  Controller, Get, Post, Body, UseGuards, Request, HttpCode, HttpStatus, UnauthorizedException, Req
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from './decorators/public.decorator'
import {TokenBlacklistService} from "./blacklist";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
              private tokenBlacklistService: TokenBlacklistService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: { username: string, password: string }) {
    return await this.authService.login(body.username, body.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() body: { username: string, email: string, password: string }) {
    console.log("Received Register Request");
    return this.authService.signUp(body.username, body.email, body.password);
  }

  @Post('logout')
  async logout(@Request() req) {
      this.tokenBlacklistService.addToBlacklist(req.accessToken);
      return { message: 'Logged Out' };
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user.username;
  }
}
