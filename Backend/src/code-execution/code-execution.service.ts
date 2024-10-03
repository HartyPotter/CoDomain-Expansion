import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { spawn } from 'child_process';
import { WebSocketServer } from 'ws';
// import Docker from 'dockerode';

const Docker = require('dockerode');
const docker = new Docker();
const { PassThrough } = require('stream');
const util = require('util');

const wss = new WebSocketServer({ port: 3000 })

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

@Injectable()
export class CodeExecutionService {
    // private readonly pistonAPI = axios.create({
    //   baseURL: "https://emkc.org/api/v2/piston",
    // });


    async startContainer() {
        volume = await docker.createVolume({
            Name: `volume_1`,
            Driver: 'local',
        })

        container = await docker.createContainer({
            Image: "python:3.9-slim",
            Tty: true,
            HostConfig: {
                Binds: [`${volume.Name}:/app`],  // Bind the volume to `/app`
            },
        });

        await container.start();

        // dockerode
        const exec = await container.exec({
            Cmd: ['bin/bash'],
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,  // TTY for interactive terminal
        })
        
        // console.log("STARTED CONTAINER AND VOLUME\n");

        // simple-dockerode
        // const exec = await container.exec(['bin/bash'], {
        //     stdin: true,
        //     stdout: true,
        //     stderr: true,
        //     live: true,
        // })


        // stream = await exec.start();
        // console.log("Steam: ", stream);
    }

    async executeCode(code: string, language: string, version: string): Promise<{ output: string }> {
        // try {
        //   // Submit the code
        //   const response = await this.pistonAPI.post("/execute", {
        //     language,
        //     version,
        //     files: [
        //       {
        //         content: code,
        //       }
        //     ]
        //   });
        //
        //   console.log(response.data)
        //   return response.data;
        //
        // } catch (error) {
        //   console.error('Error executing code:', error);
        //   throw new Error(error);
        // }

        // await container.start();


        // const logsStream = await container.logs({
        //   follow: true,
        //   stdout: true,
        //   stderr: true,
        // });

        if (!container)
            await this.startContainer();

        // console.log("FUCKKKK");

        // console.log("Why Reaching Here????\n");

        // dockerode
        const exec = await container.exec({
            Cmd: ['bash', '-c', `
    cat <<EOF > /app/code.py
${code}
EOF
    python /app/code.py`],
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,  // TTY for interactive terminal
        })

        // simple-dockerode
//         const exec = await container.exec([`bash -c
//     cat <<EOF > /app/code.py
// ${code}
// EOF`
//     , 'python /app/code.py'], {
//             stdin: true,
//             stdout: true,
//             stderr: true,
//             live: true,  // TTY for interactive terminal
//         })

        const stream = await exec.start();
        const output = await getStreamData(stream); // Capture the output stream
        console.log(output.toString());
        return { output: output.toString() };

        // const logs = await getStreamData(logsStream);
        // console.log(logs);
        //
        // await container.remove();
    }


    async executeTerminal(command: string): Promise<any> {
        wss.on('connection', (ws) => {
            const docker_process = spawn('docker', ['run', '-i', 'python:3.9-slim', 'bash']);
            docker_process.stdout.on('data', (data) => {
                ws.send(data.toString());
            });

            docker_process.stderr.on('data', (data) => {
                ws.send(data.toString());
            })

            ws.on('message', (message) => {
                docker_process.stdin.write(message.toString());
            })

            docker_process.on('close', (code) => {
                console.log(`Docker process exited with code ${code}`);
                ws.close();
            });

            ws.on('close', () => {
                console.log('WebSocket closed');
                docker_process.kill();
            });
        })
    }
}
