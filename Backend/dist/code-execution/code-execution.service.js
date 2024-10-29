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
const ws_1 = require("ws");
const websocketStream = require("websocket-stream");
const pty = require('node-pty');
const code = "import datetime; print(datetime.date.today())";
let isOutputEnabled = true;
let CodeExecutionService = class CodeExecutionService {
    async createVolume(volumeName) {
        try {
            pty.spawn('docker', ['volume', 'create', '--name', volumeName]);
        }
        catch {
            console.log("Couldn't create volume");
        }
    }
    async openProject(volume, image) {
        this.wss = new ws_1.WebSocketServer({ port: 4000 });
        this.wss.on('connection', (ws) => {
            console.log('New connection established');
            console.log('My volume name is:', volume);
            const duplex = websocketStream(ws, { encoding: 'utf8' });
            const proc = pty.spawn('docker', ['run', "--rm", "-ti", "-v", `${volume}:/app`, "python:3.9-slim", "bash"]);
            const executeSilentCommand = (command) => {
                isOutputEnabled = false;
                proc.write(command);
                setTimeout(() => {
                    isOutputEnabled = true;
                }, 1000);
            };
            const onData = proc.onData((data) => {
                console.log("Process Received Data: ", data);
                if (isOutputEnabled) {
                    duplex.write(data);
                }
            });
            const exit = proc.onExit(() => {
                console.log("Process exited");
                onData.dispose();
                exit.dispose();
            });
            duplex.on('data', (data) => proc.write(data.toString()));
            console.log("WS IS OPEN");
            setTimeout(() => {
                executeSilentCommand(`echo \"${code}\" >> /app/code.py \r`);
            }, 2000);
            duplex.on('error', (err) => {
                console.log("Error: ", err);
            });
            proc.on('error', (err) => {
                console.log("Error Process: ", err);
            });
            ws.on('close', function () {
                console.log('Stream closed');
                proc.kill();
                duplex.destroy();
            });
        });
    }
    closeProject(projectId, wss, proc) {
        console.log(`Closing project ${projectId}`);
        proc.kill();
        wss.close();
    }
};
exports.CodeExecutionService = CodeExecutionService;
exports.CodeExecutionService = CodeExecutionService = __decorate([
    (0, common_1.Injectable)()
], CodeExecutionService);
//# sourceMappingURL=code-execution.service.js.map