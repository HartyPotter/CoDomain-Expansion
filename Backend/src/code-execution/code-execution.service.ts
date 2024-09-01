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


@Injectable()
export class CodeExecutionService {
  // private readonly pistonAPI = axios.create({
  //   baseURL: "https://emkc.org/api/v2/piston",
  // });

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

    const container = await docker.createContainer({
      Image: "python:3-slim",
      Tty: false,
      Cmd: ['python', '-c', code]
    });

    await container.start();
    const logsStream = await container.logs({
      follow: true,
      stdout: true,
      stderr: true,
    });
    const logs = await getStreamData(logsStream);
    console.log(logs);

    await container.remove();
    return { output: logs };
  }
}
