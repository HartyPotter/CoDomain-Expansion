import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
  providers: [DatabaseService, RedisService],
  exports: [DatabaseService, RedisService],
})
export class DatabaseModule {}
