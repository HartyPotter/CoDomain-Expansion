import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/PostgresDB/database.service'
import { Prisma } from '@prisma/client'
import { dateTimestampProvider } from "rxjs/internal/scheduler/dateTimestampProvider";

@Injectable()
export class ProjectsService {
  constructor(private readonly databaseService : DatabaseService) {}

  async create(createProjectDto: Prisma.ProjectCreateInput, id : number) {
    const user = this.databaseService.user.findUnique({
      where: {
        id,
      }
    });
    return this.databaseService.project.create({
      data: {
        name: createProjectDto.name,
        language: createProjectDto.language,
        isPublic: createProjectDto.isPublic,
        volumePath: createProjectDto.volumePath,
        lastAccessed: new Date(),
        UserProject: {
          create: {
            user: {
              connect: {id: id},
            },
            role: 'Owner',
          }
        }
      }
    })
  }

  // async findAll() {
  //   return this.databaseService.user.findMany({
  //
  //   });
  // }

  async findCollaborators(id: number) {
    // const project = await this.databaseService.project.findUnique({
    //   where: {
    //     id,
    //   },
    //   select: {
    //     id: true,
    //   }
    // });

    // return the records from UserProject Table
    // which have projectId: id
    // select the user field of these records
    // return the usernames
    const collaborators = await this.databaseService.userProject.findMany({
      where: {
        projectId: id,
      },
      select: {
        user: {
          select: {
            username: true,
          }
        }
      }
    })
    return collaborators.map(collaborator => collaborator.user.username);
  }


  async findOne(id: number) {
    return this.databaseService.project.findUnique({
      where: {
        id,
      }
    });
  }

  async update(id: number, updateProjectDto: Prisma.ProjectUpdateInput) {
    return this.databaseService.project.update({
      where: {
        id,
      },
      data: {
        ...updateProjectDto,
        lastAccessed: new Date(),
      },
    });
  }

  async remove(id: number) {
    return this.databaseService.project.delete({
      where: {
        id,
      }
    });
  }
}
