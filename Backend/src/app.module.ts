import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './PostgresDB/database.module';
import { AuthModule } from './auth/auth.module';
import { CodeExecutionModule } from './code-execution/code-execution.module';
import { RedisService } from './redis/redis.service';
import { ProjectsModule } from "./projects/projects.module";
import { CodeExecutionController } from "./code-execution/code-execution.controller";
import { CodeExecutionService } from "./code-execution/code-execution.service";
import { FilesystemService } from './filesystem/filesystem.service';
import { FilesystemModule } from './filesystem/filesystem.module';


@Module({
    imports: [AuthModule, DatabaseModule, UsersModule, CodeExecutionModule, ProjectsModule, FilesystemModule],
    controllers: [CodeExecutionController],
    providers: [CodeExecutionService, RedisService, FilesystemService],
})
export class AppModule {}
