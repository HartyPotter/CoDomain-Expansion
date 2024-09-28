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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeExecutionController = void 0;
const common_1 = require("@nestjs/common");
const code_execution_service_1 = require("./code-execution.service");
let CodeExecutionController = class CodeExecutionController {
    constructor(codeExecutionService) {
        this.codeExecutionService = codeExecutionService;
    }
    async executeCode(code, lang, version) {
        return await this.codeExecutionService.executeCode(code, lang, version);
    }
    async executeTerminal(command) {
        console.log("SSSS: ", command);
        const result = await this.codeExecutionService.executeTerminal(command);
        console.log("RESULT FROM endpoint: ", result);
        return result;
    }
};
exports.CodeExecutionController = CodeExecutionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)('sourceCode')),
    __param(1, (0, common_1.Body)('language')),
    __param(2, (0, common_1.Body)('version')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CodeExecutionController.prototype, "executeCode", null);
__decorate([
    (0, common_1.Post)('terminal'),
    __param(0, (0, common_1.Body)('command')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CodeExecutionController.prototype, "executeTerminal", null);
exports.CodeExecutionController = CodeExecutionController = __decorate([
    (0, common_1.Controller)('execute'),
    __metadata("design:paramtypes", [code_execution_service_1.CodeExecutionService])
], CodeExecutionController);
//# sourceMappingURL=code-execution.controller.js.map