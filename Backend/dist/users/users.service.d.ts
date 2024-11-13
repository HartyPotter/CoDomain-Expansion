import { Prisma } from '@prisma/client';
import { DatabaseService } from '../PostgresDB/database.service';
export declare class UsersService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(createUserDto: Prisma.UserCreateInput): Promise<{
        id: number;
        first_name: string;
        last_name: string;
        age: number;
        username: string;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: number;
        first_name: string;
        last_name: string;
        age: number;
        username: string;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findByID(id: number): Promise<{
        id: number;
        first_name: string;
        last_name: string;
        age: number;
        username: string;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByUsername(username: string): Promise<{
        id: number;
        first_name: string;
        last_name: string;
        age: number;
        username: string;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        id: number;
        first_name: string;
        last_name: string;
        age: number;
        username: string;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findUserProjects(id: number): Promise<{
        project: {
            id: number;
            name: string;
            language: string;
            volumeName: string;
        };
    }[]>;
    update(id: number, updateUserDto: Prisma.UserUpdateInput): Promise<{
        id: number;
        first_name: string;
        last_name: string;
        age: number;
        username: string;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        first_name: string;
        last_name: string;
        age: number;
        username: string;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
