import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisService } from 'src/redis/redis.service';
import { UsersService } from 'src/users/users.service';

export interface RedisUser {
  id: string;
  first_name: string;
  last_name: string;
  age: string;
  username: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private Redis: RedisService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_TOKEN_SECRET,
    });
  }

  async validate(payload: any): Promise<RedisUser> {
    // Look up redis to extract more user data, or check if the token is revoked
    const redis = await this.Redis.getClient();
    const user = await redis.hGetAll(`user:${+payload.sub}`)
    
    if (!user || Object.keys(user).length === 0) {
      throw new UnauthorizedException();
    }

    const redisUser: RedisUser = {
      id: payload.sub,
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
      username: user.username,
      email: user.email,
    };

    return redisUser;
  }
  
}
