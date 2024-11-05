// import { Injectable } from '@nestjs/common';
// import { spawn } from 'child_process';
// import { WebSocket, WebSocketServer } from 'ws';
// import * as websocketStream from 'websocket-stream';

// // Import pty using require if import is not working
// const pty = require('node-pty');


// const code = "import datetime; print(datetime.date.today())"
// let isOutputEnabled = true;

// @Injectable()
// export class CodeExecutionService {
//     private wss : WebSocketServer;

//     async createVolume(volumeName: string) {
//         try {
//             pty.spawn('docker', ['volume', 'create', '--name', volumeName]);
//         }
//         catch {
//             console.log("Couldn't create volume")
//         }
//     }

//     async openProject(volume: string, image: string): Promise<any> {
//         this.wss = new WebSocketServer({ port: 4000 });

//         this.wss.on('connection', (ws) => {
//             console.log('New connection established');
//             console.log('My volume name is:', volume);

//             const duplex = websocketStream(ws, { encoding: 'utf8' });

//             // const create_volume = pty.spawn('docker', ['volume', 'create', '--name', 'volume_1']);

//             const proc = pty.spawn('docker', ['run', "--rm", "-ti", "-v", `${volume}:/app`, "python:3.9-slim", "bash"])

//             const executeSilentCommand = (command: string) => {
//                 isOutputEnabled = false;
//                 proc.write(command);
                
//                 setTimeout(() => {
//                     isOutputEnabled = true;
//                 }, 1000)
//             }
            
//             // Write from the docker process to the websocket duplex stream
//             const onData = proc.onData((data) => {
//                 console.log("Process Received Data: ", data);
//                 if (isOutputEnabled) {
//                     duplex.write(data);                    
//                 }
//             });

//             const exit = proc.onExit(() => {
//                 console.log("Process exited");
//                 onData.dispose();
//                 exit.dispose();
//             });

//             // write from the duplex stream to the docker process
//             duplex.on('data', (data) => proc.write(data.toString()));
//             // console.log(duplex);

//             console.log("WS IS OPEN");

//             setTimeout(() => {
//                 executeSilentCommand(`echo \"${code}\" >> /app/code.py \r`);
//             }, 2000);


//             duplex.on('error', (err) => {
//                 console.log("Error: ", err);
//             })

//             proc.on('error', (err) => {
//                 console.log("Error Process: ", err);
//             })

//             ws.on('close', function () {
//                 console.log('Stream closed');
//                 proc.kill();
//                 duplex.destroy();
//             });

//         });
//     }

//     closeProject(projectId: string, wss: WebSocketServer, proc: any): void {
//         console.log(`Closing project ${projectId}`);
//         proc.kill();
//         wss.close();
//     }

// }
