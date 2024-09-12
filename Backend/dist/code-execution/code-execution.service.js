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
let container = null;
let volume = null;
let logs = null;
let exec = null;
let stream = null;
let CodeExecutionService = class CodeExecutionService {
    async startContainer() {
        console.log("STARTED CONTAINER\n");
        volume = await docker.createVolume({
            Name: `volume_1`,
            Driver: 'local',
        });
        container = await docker.createContainer({
            Image: "python:3-slim",
            Tty: true,
            HostConfig: {
                Binds: [`${volume.Name}:/app`],
            },
        });
        await container.start();
        const exec = await container.exec({
            Cmd: ['/bin/bash'],
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
        });
        stream = await exec.start();
    }
    async executeCode(code, language, version) {
        if (!container)
            await this.startContainer();
        console.log("Why Reaching Here????\n");
        const exec = await container.exec({
            Cmd: ['bash', '-c', `
    cat <<EOF > /app/code.py
${code}
EOF
    python /app/code.py`],
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
        });
        const stream = await exec.start();
        const output = await getStreamData(stream);
        return { output: output.toString() };
    }
    async executeTerminal(command) {
        if (!container)
            await this.startContainer();
        if (!stream)
            console.log("Stream not initialized");
        console.log("We're here!!!!\n");
        console.log("Command: ", command);
        stream.stdin.write(`${command}\n`);
        const output = await getStreamData(stream);
        console.log("Output: ", output);
        return { output: output.toString() };
    }
};
exports.CodeExecutionService = CodeExecutionService;
exports.CodeExecutionService = CodeExecutionService = __decorate([
    (0, common_1.Injectable)()
], CodeExecutionService);
//# sourceMappingURL=code-execution.service.js.map