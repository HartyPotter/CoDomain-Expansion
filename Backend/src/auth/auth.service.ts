import * as bcrypt from 'bcryptjs';
import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService,
              private jwtService: JwtService,
              private Redis: RedisService
  ) {}

  // Helper Methods
  private async generateAcessToken(username: string, userID: string): Promise<string> {
    const payload = { sub: userID, username: username };
    return await this.jwtService.signAsync(payload);
  }

  // Used to verify the user's credentials and sending the user back to the invoking function
  async validateCredentials(loginUserDto): Promise<any> {
    const user = await this.userService.findByUsername(loginUserDto.username);

    if (!user) {
      throw new NotFoundException('User with the provided username was not found');
    }

    if (!await bcrypt.compare(loginUserDto.password, user.password)) {
      throw new UnauthorizedException('Invalid password. Please try again');
    }

    const { password, createdAt, updatedAt, ...result } = user; // Filtering out the password

    return result;
  }

  // private async generateRefreshToken(userID: string): Promise<string> {
  //   const payload = { sub: userID};
  //   return await this.jwtService.signAsync(payload, {secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '14d'});
  // }

  // private async refreshToken(oldToken: string) {
  //   try {
  //     const decoded = await this.jwtService.verifyAsync(oldToken, { secret: process.env.REFRESH_TOKEN_SECRET });
  //     const userID = decoded.sub;

  //     const newAcessToken = await this.jwtService.signAsync(userID);

  //     return { acessToken: newAcessToken }
  //   } catch (error) {
  //       throw new UnauthorizedException("Invalid refresh token");
  //   }
  // }


  // register
  async register(registerUserDto: RegisterUserDto): Promise<any> {

    // Check for used usernames
    if (await this.userService.findByUsername(registerUserDto.username)) {
      return null;
    }

    // Check for registered emails
    if (await this.userService.findByEmail(registerUserDto.email)) {
      return null;
    }

    const password = await bcrypt.hash(registerUserDto.password, 10);
    const user = this.userService.create({...registerUserDto, password});

    // Make sure the user is saved and returned with an id
    if (!user) {
      throw new Error('User creation failed');
    }

    return user;
  }


  // Log in
  async login(loginUserDto: LoginUserDto) {

    const user = await this.validateCredentials(loginUserDto);

    if (!user) {
      throw new HttpException("Invalid login attempt. Try again.", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const accessToken = await this.generateAcessToken(loginUserDto.username, user.id.toString());
    console.log("Access Token: ", accessToken);

    const redis = await this.Redis.getClient();

    // await redis.set(`token:${accessToken}`, user.id, {'EX': 7 * 24 * 60 * 60});

    // Set the user in the Redis DB
    await redis.hSet(`user:${accessToken}`, user);
    await redis.expire(`user:${accessToken}`, 7 * 24 * 60 * 60);

    return {
      user,
      accessToken
    }
  }


  async logout(token: any) {
    const redis = await this.Redis.getClient();
    try {
      await redis.del(`user:${token}`);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

//   async check_user_status() {

//   }
}
