import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { DatabaseService } from 'src/PostgresDB/database.service'
import { Prisma } from '@prisma/client'
import { Public } from 'src/auth/decorators/public.decorator'

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post(':id')
  create(@Body() createProjectDto: Prisma.ProjectCreateInput, @Param('id') id: string) {
    return this.projectsService.create(createProjectDto, +id);
  }

  // Get the single project with id `id`
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Get(':id/collaborators')
  findCollaborators(@Param('id') id: string) {
    return this.projectsService.findCollaborators(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: Prisma.ProjectUpdateInput) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
