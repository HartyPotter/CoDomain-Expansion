import { Injectable } from '@nestjs/common';
import axios from 'axios';

const Docker = require('dockerode');
const docker = new Docker();
const { PassThrough } = require('stream');
const util = require('util');

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
        console.log("STARTED CONTAINER\n");
        volume = await docker.createVolume({
            Name: `volume_1`,
            Driver: 'local',
        })

        container = await docker.createContainer({
            Image: "python:3-slim",
            Tty: true,
            HostConfig: {
                Binds: [`${volume.Name}:/app`],  // Bind the volume to `/app`
            },
        });

        await container.start();

        const exec = await container.exec({
            Cmd: ['/bin/bash'],
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,  // TTY for interactive terminal
        })
        stream = await exec.start();
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

      console.log("Why Reaching Here????\n");
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
    const stream = await exec.start();
    const output = await getStreamData(stream); // Capture the output stream
      return { output: output.toString() };

    // const logs = await getStreamData(logsStream);
    // console.log(logs);
    //
    // await container.remove();
  }


  async executeTerminal(command : string): Promise<{ output: string }> {
        if (!container)
            await this.startContainer();

        if (!stream)
            console.log("Stream not initialized");

        console.log("We're here!!!!\n");

      // console.log("Stream: ", stream)
      console.log("Command: ", command);
      stream.stdin.write(`${command}\n`);
      const output = await getStreamData(stream); // Capture the output stream
      console.log("Output: ", output)
      return { output: output.toString() };
  }
}
