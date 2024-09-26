import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service'
import { Prisma } from '@prisma/client'

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
        lastAccessed: createProjectDto.lastAccessed,
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

  async findAll(userId: number) {
    const userWithProjects = await this.databaseService.user.findMany({
      relationLoadStrategy: 'join',
      include: {
        UserProject: {
          select: {
            project: {
              select: {
                name: true,
              }
            }
          },
        },
      },
    });
    console.log(userWithProjects);
    // Return only the projects from UserProject
    return {};
  }


  async findOne(id: number) {
    return this.databaseService.project.findUnique({
      where: {
        id,
      }
    });
  }

  async update(id: number, updateProjectDto: Prisma.ProjectUpdateInput) {
    return `This action updates a #${id} project`;
  }

  async remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
