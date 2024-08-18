"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeExecutionService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let CodeExecutionService = class CodeExecutionService {
    constructor() {
        this.pistonAPI = axios_1.default.create({
            baseURL: "https://emkc.org/api/v2/piston",
        });
    }
    async executeCode(code, language, version) {
        try {
            const response = await this.pistonAPI.post("/execute", {
                language,
                version,
                files: [
                    {
                        content: code,
                    }
                ]
            });
            console.log("RESPONSE FROM THE ackend TRY BLOCK");
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.log("RESPONSE FROM THE backend CATCH BLOCK");
            console.error('Error executing code:', error);
            throw new Error(error);
        }
    }
};
exports.CodeExecutionService = CodeExecutionService;
exports.CodeExecutionService = CodeExecutionService = __decorate([
    (0, common_1.Injectable)()
], CodeExecutionService);
//# sourceMappingURL=code-execution.service.js.map