import { Controller, Post, Body } from '@nestjs/common';
import { CodeExecutionService } from './code-execution.service';
import { ProjectsService } from '../projects/projects.service'

@Controller('execute')
export class CodeExecutionController {
  constructor(private readonly codeExecutionService: CodeExecutionService) {}

  @Post('volume')
  async createVolume(@Body('volumeName') volumeName: string) {
      console.log("Will create Volume with name:", volumeName)
      await this.codeExecutionService.createVolume(volumeName);
  }
  
}