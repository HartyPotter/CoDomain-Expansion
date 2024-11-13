import { DatabaseService } from 'src/PostgresDB/database.service';
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
        volumeName: string;
    }>;
    findCollaborators(id: number): Promise<string[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        language: string;
        createdAt: Date;
        lastAccessed: Date;
        isPublic: boolean;
        volumePath: string;
        volumeName: string;
    }>;
    update(id: number, updateProjectDto: Prisma.ProjectUpdateInput): Promise<{
        id: number;
        name: string;
        language: string;
        createdAt: Date;
        lastAccessed: Date;
        isPublic: boolean;
        volumePath: string;
        volumeName: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        language: string;
        createdAt: Date;
        lastAccessed: Date;
        isPublic: boolean;
        volumePath: string;
        volumeName: string;
    }>;
}
