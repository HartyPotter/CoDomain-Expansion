import { Module } from '@nestjs/common';
import { CodeExecutionController } from './code-execution/code-execution.controller';
import { CodeExecutionService } from './code-execution/code-execution.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, DatabaseModule, UsersModule],
  controllers: [CodeExecutionController],
  providers: [CodeExecutionService],
})
export class AppModule {}
