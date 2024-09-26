import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
export declare class ProjectsService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(createProjectDto: Prisma.ProjectCreateInput, id: number): Promise<{
        id: number;
        name: string;
        language: string;
        createdAt: Date;
        lastAccessed: Date;
        isPublic: boolean;
        volumePath: string;
    }>;
    findAll(userId: number): Promise<{}>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        language: string;
        createdAt: Date;
        lastAccessed: Date;
        isPublic: boolean;
        volumePath: string;
    }>;
    update(id: number, updateProjectDto: Prisma.ProjectUpdateInput): Promise<string>;
    remove(id: number): Promise<string>;
}
