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
const child_process_1 = require("child_process");
const ws_1 = require("ws");
const Docker = require('dockerode');
const docker = new Docker();
const { PassThrough } = require('stream');
const util = require('util');
const wss = new ws_1.WebSocketServer({ port: 3000 });
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
        volume = await docker.createVolume({
            Name: `volume_1`,
            Driver: 'local',
        });
        container = await docker.createContainer({
            Image: "python:3.9-slim",
            Tty: true,
            HostConfig: {
                Binds: [`${volume.Name}:/app`],
            },
        });
        await container.start();
        const exec = await container.exec({
            Cmd: ['bin/bash'],
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
        });
    }
    async executeCode(code, language, version) {
        if (!container)
            await this.startContainer();
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
        console.log(output.toString());
        return { output: output.toString() };
    }
    async executeTerminal(command) {
        wss.on('connection', (ws) => {
            const docker_process = (0, child_process_1.spawn)('docker', ['run', '-i', 'python:3.9-slim', 'bash']);
            docker_process.stdout.on('data', (data) => {
                ws.send(data.toString());
            });
            docker_process.stderr.on('data', (data) => {
                ws.send(data.toString());
            });
            ws.on('message', (message) => {
                docker_process.stdin.write(message.toString());
            });
            docker_process.on('close', (code) => {
                console.log(`Docker process exited with code ${code}`);
                ws.close();
            });
            ws.on('close', () => {
                console.log('WebSocket closed');
                docker_process.kill();
            });
        });
    }
};
exports.CodeExecutionService = CodeExecutionService;
exports.CodeExecutionService = CodeExecutionService = __decorate([
    (0, common_1.Injectable)()
], CodeExecutionService);
//# sourceMappingURL=code-execution.service.js.map