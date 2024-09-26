import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/PostgresDB/database.service'
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private readonly databaseService : DatabaseService) {}

  async create(createProjectDto: Prisma.ProjectCreateInput) {
    // const user = this.databaseService.user.findUnique({
    //   where: {
    //     id,
    //   }
    // });
    // return this.databaseService.project.create({
    //   data: {
    //     name: createProjectDto.name,
    //     language: createProjectDto.language,
    //     isPublic: createProjectDto.isPublic,
    //
    //   }
    // })
  }

  async findAll() {
    return `This action returns all projects`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  async update(id: number, updateProjectDto: Prisma.ProjectUpdateInput) {
    return `This action updates a #${id} project`;
  }

  async remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
