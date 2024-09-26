import { DatabaseService } from 'src/PostgresDB/database.service';
import { Prisma } from '@prisma/client';
export declare class ProjectsService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(createProjectDto: Prisma.ProjectCreateInput): Promise<void>;
    findAll(): Promise<string>;
    findOne(id: number): Promise<string>;
    update(id: number, updateProjectDto: Prisma.ProjectUpdateInput): Promise<string>;
    remove(id: number): Promise<string>;
}
