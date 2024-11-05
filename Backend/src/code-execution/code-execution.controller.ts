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
  
//   @Post('open')
//   async openProject( @Body('volume') volume: string,
//                      @Body('image') image: string ): 
//                     Promise<{ websocketUrl: string }> {
//       console.log("Received an Open Request");
//       await this.codeExecutionService.openProject(volume, image);
//       return { websocketUrl : 'ws://localhost:4000'};
//   }
}