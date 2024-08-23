import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../users/users.service';
import { UsersController } from '../users/users.controller';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';
import { jwtConstants } from './constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';


@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    })
  ],
  controllers: [AuthController, UsersController],
  providers: [AuthService, JwtStrategy, UsersService, DatabaseService, {
    provide: APP_GUARD, // With this in place, Nest will automatically bind AuthGuard to all endpoints.
    useClass: AuthGuard,
  }],
})
export class AuthModule {}
