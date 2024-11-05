import { Module } from '@nestjs/common';
import { CodeExecutionGateway } from './code-execution.gateway';
import { CodeExecutionService } from './code-execution.service'
import { CodeExecutionController } from './code-execution.controller'

@Module({
  controllers: [CodeExecutionController],
  providers: [CodeExecutionService, CodeExecutionGateway],
  exports: [CodeExecutionModule]
})
export class CodeExecutionModule {}