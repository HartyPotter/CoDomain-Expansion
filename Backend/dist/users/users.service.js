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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../PostgresDB/database.service");
let UsersService = class UsersService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async create(createUserDto) {
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
    async findByID(id) {
        return this.databaseService.user.findUnique({
            where: {
                id,
            }
        });
    }
    async findByUsername(username) {
        return this.databaseService.user.findUnique({
            where: {
                username,
            }
        });
    }
    async findByEmail(email) {
        return this.databaseService.user.findUnique({
            where: {
                email,
            }
        });
    }
    async findUserProjects(id) {
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
        return projects;
    }
    async update(id, updateUserDto) {
        return this.databaseService.user.update({
            where: {
                id,
            },
            data: updateUserDto,
        });
    }
    async remove(id) {
        return this.databaseService.user.delete({
            where: {
                id,
            }
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UsersService);
//# sourceMappingURL=users.service.js.map