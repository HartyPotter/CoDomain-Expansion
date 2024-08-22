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


@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    })
  ],
  controllers: [AuthController, UsersController],
  providers: [AuthService, JwtStrategy, UsersService, DatabaseService],
})
export class AuthModule {}
