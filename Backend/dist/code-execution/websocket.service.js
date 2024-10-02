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
const pty = require('node-pty');
let WebSocketService = class WebSocketService {
    onModuleInit() {
        this.wss = new ws_1.WebSocketServer({ port: 4000 });
        this.wss.on('connection', (ws) => {
            console.log('New connection established');
            const duplex = (0, ws_1.createWebSocketStream)(ws, { encoding: 'utf8' });
            const proc = pty.spawn('docker', ['run', "--rm", "-ti", "python:3.9-slim", "bash"], {
                name: 'xterm-color',
            });
            const onData = proc.onData((data) => duplex.write(data));
            const exit = proc.onExit(() => {
                console.log("Process exited");
                onData.dispose();
                exit.dispose();
            });
            duplex.on('data', (data) => proc.write(data.toString()));
            ws.on('close', function () {
                console.log('Stream closed');
                proc.kill();
                duplex.destroy();
            });
        });
    }
    onModuleDestroy() {
        if (this.wss) {
            console.log('Closing WebSocket server');
            this.wss.close();
        }
    }
};
exports.WebSocketService = WebSocketService;
exports.WebSocketService = WebSocketService = __decorate([
    (0, common_1.Injectable)()
], WebSocketService);
//# sourceMappingURL=websocket.service.js.map