import { Controller, Post, Body } from '@nestjs/common';
import { CodeExecutionService } from './code-execution.service';

@Controller('execute')
export class CodeExecutionController {
  constructor(private readonly codeExecutionService: CodeExecutionService) {}

  @Post('volume')
  async createVolume(@Body('volumeName') volumeName: string, @Body('image') image: string) {
      console.log("Will create Volume with name:", volumeName, image)
      await this.codeExecutionService.createVolume(volumeName, image);
  }
  
}