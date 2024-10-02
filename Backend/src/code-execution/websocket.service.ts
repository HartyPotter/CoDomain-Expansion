import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { WebSocketServer, createWebSocketStream } from 'ws';
// Import pty using require if import is not working
const pty = require('node-pty');

@Injectable()
export class WebSocketService implements OnModuleInit, OnModuleDestroy {
    private wss: WebSocketServer;

    onModuleInit() {
        this.wss = new WebSocketServer({ port: 4000 });

        this.wss.on('connection', (ws) => {
            console.log('New connection established');

            const duplex = createWebSocketStream(ws, { encoding: 'utf8' });

            // Ensure that pty.spawn is available and correctly used
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
}
