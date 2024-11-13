import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client'
import { DatabaseService } from '../PostgresDB/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: Prisma.UserCreateInput) {
    return this.databaseService.user.create({
      data: {
        first_name: createUserDto.first_name,
        last_name: createUserDto.last_name,
        age: createUserDto.age,
        username: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.password,
      }
    });
  }

  async findAll() {
    return this.databaseService.user.findMany();
  }

  async findByID(id: number) {
    return this.databaseService.user.findUnique({
      where: {
        id,
      }
    });
  }

  async findByUsername(username: string) {
    return this.databaseService.user.findUnique({
      where: {
        username,
      }
    });
  }

  async findByEmail(email: string) {
    return this.databaseService.user.findUnique({
      where: {
        email,
      }
    })
  }

  async findUserProjects(id: number) {

    // return the records from UserProject Table
    // which have userId: id
    // select the project of this record
    // return the project's name and language
    const projects = await this.databaseService.userProject.findMany({
      where: {
        userId: id,
      },
      select: {
        project: {
          select: {
            id: true,
            name: true,
            language: true,
            volumeName: true,
          }
        }
      }
    });
    projects.map(project => project.project);
    // console.log("FROM BACKEND: ", projects.map(project => project.project));
    return projects;
  }


  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.user.delete({
      where: {
        id,
      }
    });
  }
}
