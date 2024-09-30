"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketService = void 0;
const common_1 = require("@nestjs/common");
const ws_1 = require("ws");
const child_process_1 = require("child_process");
let WebSocketService = class WebSocketService {
    onModuleInit() {
        this.wss = new ws_1.WebSocketServer({ port: 4000 });
        console.log('WebSocket server started on port 4000');
        this.wss.on('connection', (ws) => {
            console.log('New connection');
            const docker = (0, child_process_1.spawn)('winpty', ['docker', 'run', '-it', 'python:3.9-slim', 'bash']);
            docker.stdout.on('data', (data) => {
                ws.send(data.toString());
            });
            docker.stderr.on('data', (data) => {
                ws.send(data.toString());
            });
            ws.on('message', (message) => {
                docker.stdin.write(message + '\n');
            });
            docker.on('close', (code) => {
                console.log(`Docker process exited with code ${code}`);
                ws.close();
            });
            ws.on('close', () => {
                console.log('WebSocket closed');
                docker.kill();
            });
        });
    }
    onModuleDestroy() {
        this.wss.close(() => {
            console.log('WebSocket server closed');
        });
    }
};
exports.WebSocketService = WebSocketService;
exports.WebSocketService = WebSocketService = __decorate([
    (0, common_1.Injectable)()
], WebSocketService);
//# sourceMappingURL=websocket.service.js.map