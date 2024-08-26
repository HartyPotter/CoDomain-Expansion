import * as bcrypt from 'bcryptjs';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService,
              private jwtService: JwtService,) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const {password, ...result } = user;
      return result;
    }
    return new UnauthorizedException();
  }

  async login(user: any) {
    const payload = {username: user.username, sub: user.id};
    return {
      accessToken: this.jwtService.sign(payload),
    }
  }


}
