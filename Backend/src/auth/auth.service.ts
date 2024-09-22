import * as bcrypt from 'bcryptjs';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';

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
  async validateCredentials(username: string, input_password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User with the provided username was not found');
    } 

    if (!await bcrypt.compare(input_password, user.password)) {
      throw new UnauthorizedException('Invalid password. Please try again');
    }
    
    const { password, ...result } = user; // Filtering out the password
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


  // sign up
  async signUp(first_name: string, last_name: string, age: number, username: string, email: string, password: string): Promise<any> {

    // Check for used usernames
    if (await this.userService.findByUsername(username)) {
      throw new Error('This username is already taken');
    }

    // Check for registered emails
    if (await this.userService.findByEmail(email)) {
      throw new Error('This email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userService.create({
      first_name,
      last_name,
      age,
      username,
      email,
      password: hashedPassword
    });

    // Make sure the user is saved and returned with an id
    if (!user) {
      throw new Error('User creation failed');
    }
    return await this.login(username, password);
  }


  // Log in
  async login(username: string, password: string) {

    // This step should be handled in the frontend
    // if (!username || !password) {
    //   throw new Error('Please complete all the required fields');
    // }

    const user = await this.validateCredentials(username, password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid login attempt. Try again.');
    }

    const redis = await this.Redis.getClient();
    const accessToken = await this.generateAcessToken(username, user.id.toString());
    // await redis.hSet(`token:${user.id}`, {accessToken, user: user.username, login_date: Date.now()});
    
    // await redis.set(`auth:${user.id}`, accessToken, 'EX', 3600); // Token expires in 1 hour
    await redis.set(`token:${accessToken}`, user.id, {'EX': 60});
    // await redis.hSet(`user:${user.id}`, { user }, {'EX', 3600});
    // const {createdAt, updatedAt, ...result} = user;
    // console.log(result);
    const userFlattened = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
      username: user.username,
      email: user.email
    }
    await redis.hSet(`user:${user.id}`, userFlattened);
    await redis.expire(`user:${user.id}`, 60);

    return {
      accessToken
    }
  }


  async logout(req: any) {
    const redis = await this.Redis.getClient();
    await redis.del(`user:${req.user.id}`);
  }
}
