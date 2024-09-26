import { ProjectsService } from './projects.service';
import { Prisma } from '@prisma/client';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: Prisma.ProjectCreateInput): Promise<void>;
    findAll(): Promise<string>;
    findOne(id: string): Promise<string>;
    update(id: string, updateProjectDto: Prisma.ProjectUpdateInput): Promise<string>;
    remove(id: string): Promise<string>;
}
