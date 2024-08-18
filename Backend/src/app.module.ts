import { Module } from '@nestjs/common';
import { CodeExecutionController } from './code-execution/code-execution.controller';
import { CodeExecutionService } from './code-execution/code-execution.service';

@Module({
  imports: [],
  controllers: [CodeExecutionController],
  providers: [CodeExecutionService],
})
export class AppModule {}
