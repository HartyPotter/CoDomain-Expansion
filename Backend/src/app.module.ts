import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './PostgresDB/database.module';
import { AuthModule } from './auth/auth.module';
import { CodeExecutionModule } from './code-execution/code-execution.module';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [AuthModule, DatabaseModule, UsersModule, CodeExecutionModule],
  controllers: [],
  providers: [RedisService],
})
export class AppModule {}
