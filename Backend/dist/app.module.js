"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("./users/users.module");
const database_module_1 = require("./PostgresDB/database.module");
const auth_module_1 = require("./auth/auth.module");
const code_execution_module_1 = require("./code-execution/code-execution.module");
const redis_service_1 = require("./redis/redis.service");
const projects_module_1 = require("./projects/projects.module");
const code_execution_controller_1 = require("./code-execution/code-execution.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, database_module_1.DatabaseModule, users_module_1.UsersModule, code_execution_module_1.CodeExecutionModule, projects_module_1.ProjectsModule],
        controllers: [code_execution_controller_1.CodeExecutionController],
        providers: [redis_service_1.RedisService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map