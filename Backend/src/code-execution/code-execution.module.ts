import { Module } from '@nestjs/common';
import { CodeExecutionGateway } from './code-execution.gateway';
import { CodeExecutionService } from './code-execution.service'
import { CodeExecutionController } from './code-execution.controller'
import { FilesystemModule } from 'src/filesystem/filesystem.module';

@Module({
  imports: [FilesystemModule],
  controllers: [CodeExecutionController],
  providers: [CodeExecutionService, CodeExecutionGateway],
  exports: [CodeExecutionModule]
})
export class CodeExecutionModule {}