import { ProjectsService } from './projects.service';
import { Prisma } from '@prisma/client';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: Prisma.ProjectCreateInput, id: string): Promise<{
        id: number;
        name: string;
        language: string;
        createdAt: Date;
        lastAccessed: Date;
        isPublic: boolean;
        volumePath: string;
        volumeName: string;
    }>;
    findOne(id: string): Promise<{
        id: number;
        name: string;
        language: string;
        createdAt: Date;
        lastAccessed: Date;
        isPublic: boolean;
        volumePath: string;
        volumeName: string;
    }>;
    findCollaborators(id: string): Promise<string[]>;
    update(id: string, updateProjectDto: Prisma.ProjectUpdateInput): Promise<{
        id: number;
        name: string;
        language: string;
        createdAt: Date;
        lastAccessed: Date;
        isPublic: boolean;
        volumePath: string;
        volumeName: string;
    }>;
    remove(id: string): Promise<{
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
