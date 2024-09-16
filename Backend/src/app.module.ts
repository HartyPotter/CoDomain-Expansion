import { Module } from '@nestjs/common';
import { CodeExecutionController } from './code-execution/code-execution.controller';
import { CodeExecutionService } from './code-execution/code-execution.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import {WebSocketService} from "./code-execution/websocket.service";

@Module({
  imports: [AuthModule, DatabaseModule, UsersModule],
  controllers: [CodeExecutionController],
  providers: [CodeExecutionService, WebSocketService],
})
export class AppModule {}
