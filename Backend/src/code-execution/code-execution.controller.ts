import { Controller, Post, Body } from '@nestjs/common';
import { CodeExecutionService } from './code-execution.service';

@Controller('execute')
export class CodeExecutionController {
  constructor(private readonly codeExecutionService: CodeExecutionService) {}

  @Post()
  async executeCode(@Body('sourceCode') code: string, @Body('language') lang: string, @Body('version') version: string) {
    const result = await this.codeExecutionService.executeCode(code, lang, version);
    console.log("RESULT FROM endpoint: ", result);
    return result;
  }
}