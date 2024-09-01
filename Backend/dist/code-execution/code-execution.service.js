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
const Docker = require('dockerode');
const docker = new Docker();
const { PassThrough } = require('stream');
const util = require('util');
async function getStreamData(stream) {
    const passThrough = new PassThrough();
    stream.pipe(passThrough);
    const chunks = [];
    for await (const chunk of passThrough) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString();
}
let CodeExecutionService = class CodeExecutionService {
    async executeCode(code, language, version) {
        const container = await docker.createContainer({
            Image: "python:3-slim",
            Tty: false,
            Cmd: ['python', '-c', code]
        });
        await container.start();
        const logsStream = await container.logs({
            follow: true,
            stdout: true,
            stderr: true,
        });
        const logs = await getStreamData(logsStream);
        console.log(logs);
        await container.remove();
        return { output: logs };
    }
};
exports.CodeExecutionService = CodeExecutionService;
exports.CodeExecutionService = CodeExecutionService = __decorate([
    (0, common_1.Injectable)()
], CodeExecutionService);
//# sourceMappingURL=code-execution.service.js.map