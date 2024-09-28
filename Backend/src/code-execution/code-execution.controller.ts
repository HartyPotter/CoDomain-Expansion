import { Controller, Post, Body } from '@nestjs/common';
import { CodeExecutionService } from './code-execution.service';

@Controller('execute')
export class CodeExecutionController {
  constructor(private readonly codeExecutionService: CodeExecutionService) {}

  @Post()
  async executeCode(@Body('sourceCode') code: string, @Body('language') lang: string, @Body('version') version: string) {
    return await this.codeExecutionService.executeCode(code, lang, version);
  }

  @Post('terminal')
  async executeTerminal(@Body('command') command: string) {
    console.log("SSSS: ", command);
    const result = await this.codeExecutionService.executeTerminal(command);
    console.log("RESULT FROM endpoint: ", result);
    return result;
  }
}