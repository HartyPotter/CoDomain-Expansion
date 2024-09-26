import { ProjectsService } from './projects.service';
import { Prisma } from '@prisma/client';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: Prisma.ProjectCreateInput, id: number): Promise<{
        id: number;
        name: string;
        language: string;
        createdAt: Date;
        lastAccessed: Date;
        isPublic: boolean;
        volumePath: string;
    }>;
    findAll(id: number): Promise<{}>;
    findOne(id: string): Promise<{
        id: number;
        name: string;
        language: string;
        createdAt: Date;
        lastAccessed: Date;
        isPublic: boolean;
        volumePath: string;
    }>;
    update(id: string, updateProjectDto: Prisma.ProjectUpdateInput): Promise<string>;
    remove(id: string): Promise<string>;
}
