import { Module } from '@nestjs/common';
import { CodeExecutionGateway } from './code-execution.gateway';

@Module({
  providers: [CodeExecutionGateway],
})
export class CodeExecutionModule {}