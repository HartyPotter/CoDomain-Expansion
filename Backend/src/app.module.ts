import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './PostgresDB/database.module';
import { AuthModule } from './auth/auth.module';
import { CodeExecutionModule } from './code-execution/code-execution.module';
import { RedisService } from './redis/redis.service';
import { ProjectsModule } from "./projects/projects.module";
import { CodeExecutionController } from "./code-execution/code-execution.controller";
import { CodeExecutionService } from "./code-execution/code-execution.service";
import {WebSocketService} from "./code-execution/websocket.service";

@Module({
    imports: [AuthModule, DatabaseModule, UsersModule, CodeExecutionModule, ProjectsModule],
    controllers: [CodeExecutionController],
    providers: [CodeExecutionService, RedisService, WebSocketService],
})
export class AppModule {}
