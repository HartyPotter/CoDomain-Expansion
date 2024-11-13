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
exports.CodeExecutionGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const pty = require("node-pty");
const promises_1 = require("node:fs/promises");
const DiffMatchPatch = require('diff-match-patch');
const code = '\ndef greet(name):\n print("Hello, " + name + "!")\n\ngreet("Alex")\n';
let isOutputEnabled = true;
let CodeExecutionGateway = class CodeExecutionGateway {
    constructor() {
        this.clientProcesses = new Map();
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        const proc = this.clientProcesses.get(client.id);
        if (proc) {
            proc.kill();
            this.clientProcesses.delete(client.id);
        }
    }
    handleStart(data, client) {
        const { volume, image } = data;
        const proc = pty.spawn('docker', ['run', "--rm", "-ti", "-v", `${volume}:/app`, "python:3.9-slim", "bash"], {});
        const executeSilentCommand = (command) => {
            isOutputEnabled = false;
            proc.write(command);
            setTimeout(() => {
                isOutputEnabled = true;
            }, 1000);
        };
        setTimeout(() => {
            executeSilentCommand(`echo -e '${code}' >> /app/code.py \r`);
        }, 2000);
        const onData = proc.onData((output) => {
            if (isOutputEnabled) {
                client.emit('output', output);
            }
        });
        client.on('input', (inputData) => {
            proc.write(inputData);
        });
        client.on('saveFileData', async (newData) => {
            const fileHandle = await (0, promises_1.open)(`/var/lib/docker/volumes/${volume}/_data/code.py`, 'r+');
            const fileData = await fileHandle.readFile({ encoding: 'utf-8' });
            const dmp = new DiffMatchPatch();
            const diff = dmp.patch_make(fileData, newData);
            const [newText, [success]] = dmp.patch_apply(diff, fileData);
            if (success) {
                await fileHandle.truncate(0);
                await fileHandle.write(newText, 0, 'utf-8');
                console.log("File updated successfully.");
            }
            else {
                console.error("Failed to apply patch.");
            }
            console.log("Code.py Data:", fileData);
            console.log(newData);
            await fileHandle.close();
        });
        const exit = proc.onExit(() => {
            console.log("Process exited");
            onData.dispose();
            exit.dispose();
        });
        this.clientProcesses.set(client.id, proc);
    }
};
exports.CodeExecutionGateway = CodeExecutionGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], CodeExecutionGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('start'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], CodeExecutionGateway.prototype, "handleStart", null);
exports.CodeExecutionGateway = CodeExecutionGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({ namespace: '/code-execution', cors: { origin: '*' } })
], CodeExecutionGateway);
//# sourceMappingURL=code-execution.gateway.js.map