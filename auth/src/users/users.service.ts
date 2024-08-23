import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client'
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: Prisma.UserCreateInput) {
    // const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const hashedPassword = createUserDto.password;
    return this.databaseService.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        password: hashedPassword
      }
    });
  }

  async findAll() {
    return this.databaseService.user.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.user.findUnique({
      where: {
        id,
      }
    });
  }

  async findUsername(username: string) {
    return this.databaseService.user.findUnique({
      where: {
        username,
      }
    });
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
