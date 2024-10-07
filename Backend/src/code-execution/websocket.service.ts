import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { WebSocket, WebSocketServer } from 'ws';
import * as websocketStream from 'websocket-stream';

// Import pty using require if import is not working
const pty = require('node-pty');

const code = "import datetime; print(datetime.date.today())"

@Injectable()
export class WebSocketService implements OnModuleInit, OnModuleDestroy {
    private wss: WebSocketServer;

    onModuleInit() {
        this.wss = new WebSocketServer({ port: 4000 });

        this.wss.on('connection', (ws) => {
            console.log('New connection established');

            const duplex = websocketStream(ws, { encoding: 'utf8' });

            const create_volume = pty.spawn('docker', ['volume', 'create', '--name', 'volume_1']);

            const proc = pty.spawn('docker', ['run', "--rm", "-ti", "-v", "volume_1:/app", "python:3.9-slim", "bash"])


//             proc.write(`bash -c
//     cat <<EOF > /app/code.py
// ${code}
// EOF
//     python /app/code.py`)

            const onData = proc.onData((data) => duplex.write(data));

            const exit = proc.onExit(() => {
                console.log("Process exited");
                onData.dispose();
                exit.dispose();
            });

            duplex.on('data', (data) => proc.write(data.toString()));
            // console.log(duplex);

            console.log("WS IS OPEN");

            setTimeout(() => {

                proc.write(`echo \"${code}\" > /app/code.py\r`);
            }, 2000);


            duplex.on('error', (err) => {
                console.log("Error: ", err);
            })

            proc.on('error', (err) => {
                console.log("Error Process: ", err);
            })

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

    async executeCode(code : string) {
        // proc.write('python /app/code.py');
    }
}