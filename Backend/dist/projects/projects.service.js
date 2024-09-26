"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let ProjectsService = class ProjectsService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async create(createProjectDto, id) {
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
                            connect: { id: id },
                        },
                        role: 'Owner',
                    }
                }
            }
        });
    }
    async findAll(userId) {
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
        return {};
    }
    async findOne(id) {
        return this.databaseService.project.findUnique({
            where: {
                id,
            }
        });
    }
    async update(id, updateProjectDto) {
        return `This action updates a #${id} project`;
    }
    async remove(id) {
        return `This action removes a #${id} project`;
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map