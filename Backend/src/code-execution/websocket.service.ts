// websocket.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { WebSocketServer } from 'ws';
import { spawn } from 'child_process';

@Injectable()
export class WebSocketService implements OnModuleInit, OnModuleDestroy {
    private wss: WebSocketServer;

    onModuleInit() {
        this.wss = new WebSocketServer({ port: 4000 });
        console.log('WebSocket server started on port 4000');

        this.wss.on('connection', (ws) => {
            console.log('New connection');

            const docker = spawn('docker', ['run', '-it', 'python:3.9-slim', 'bash']);

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
}
