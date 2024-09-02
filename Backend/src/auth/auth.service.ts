import * as bcrypt from 'bcryptjs';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService,
              private jwtService: JwtService,) {}

  private blacklist = new Set<string>();

  async login(username: string, password: string) {
    if (!username || !password) {
      throw new Error('Please complete all the required fields');
    }
    const user = await this.userService.findUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const payload = {username: user.username, sub: user.id};
      return {
        accessToken: await this.jwtService.signAsync(payload),
      }
    }
    return new UnauthorizedException();
  }

  async signUp(username: string, email: string, password: string): Promise<any> {

    // Check for empty fields
    if (!username || !email || !password ) {
      throw new Error('Please complete all the required fields');
    }

    // Check for used usernames
    if (await this.userService.findUsername(username)) {
      throw new Error('This username is already taken');
    }

    // Check for registered emails
    if (await this.userService.findEmail(email)) {
      throw new Error('This email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userService.create({
      username: username,
      email: email,
      password: hashedPassword
    });

    // Make sure the user is saved and returned with an id
    if (!user) {
      throw new Error('User creation failed');
    }
    return await this.login(username, password);
  }
}
