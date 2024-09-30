import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisService } from 'src/redis/redis.service';
import { UsersService } from 'src/users/users.service';

export interface RequestWithUser {
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

    const cookieExtractor = (req: Request): string | null => {
      let token = null;

      // Ensure the request has cookies
      if (req && req.cookies) {
        token = req.cookies['accessToken'];  // Extract token from the 'accessToken' cookie
      }

      return token;
    };

    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_TOKEN_SECRET,
      passReqToCallback: true, // This allows us to pass the request to the validate method
    });
  }

  async validate(req: Request, payload: any): Promise<RequestWithUser> {
    // const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const token = req.cookies?.accessToken;

    // Look up redis to extract more user data, or check if the token is revoked
    const redis = await this.Redis.getClient();
    const user = await redis.hGetAll(`user:${token}`)

    if (!user || Object.keys(user).length === 0) {
      throw new UnauthorizedException("User not logged in.");
    }

    if (user.id != payload.sub) {
      throw new UnauthorizedException("Wrong token.");
    }

    const req_w_user: RequestWithUser = {
      id: payload.sub,
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
      username: user.username,
      email: user.email,
    };

    return req_w_user;
  }

}