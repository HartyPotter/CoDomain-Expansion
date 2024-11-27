import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as pty from 'node-pty';
import { open } from 'node:fs/promises';
import { FilesystemService } from 'src/filesystem/filesystem.service';
const DiffMatchPatch = require('diff-match-patch');

const code = '\ndef greet(name):\n print("Hello, " + name + "!")\n\ngreet("Alex")\n';
let isOutputEnabled = true;


@Injectable()
@WebSocketGateway({ namespace: '/code-execution', cors: { origin: '*' } })
export class CodeExecutionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private clientProcesses = new Map<string, any>();
  private volumeNames = new Map<string, string>();
  private images = new Map<string, string>();
  constructor(private readonly filesystemService: FilesystemService) {}


  handleConnection(client: Socket) {
    const volumeName = client.handshake.query.volumeName as string;
    const image = client.handshake.query.image as string;
    this.volumeNames.set(client.id, volumeName);
    this.images.set(client.id, image);

    const proc = pty.spawn('docker', [
      'run', "--rm", "-ti", 
      "--user", `${process.getuid()}:${process.getgid()}`,
      "--mount", `type=bind,source=${process.env.DOCKER_VOLUMES_PATH}/${volumeName},target=/app`,
      "python:3.9-slim", 
      "bash"], {})

    this.clientProcesses.set(client.id, proc);

    console.log(`Client connected: ${client.id} with volume ${volumeName} and image ${image}`);
    // client.emit('connected', {
    //   mainFolderContent: await this.filesystemService.getMainFolderContent(),
    // });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const proc = this.clientProcesses.get(client.id);
    if (proc) {
      proc.kill();
      this.clientProcesses.delete(client.id);
    }
  }

  @SubscribeMessage('start')
  handleStart(
    @MessageBody() data: { volumeName: string; image: string },
    @ConnectedSocket() client: Socket,
  ) {
    // console.log(data);
    const { volumeName, image } = data;

    // console.log("VOLUME NAEM: ", volumeName);

    const proc = this.clientProcesses.get(client.id);
    // Spawn Docker container with the specified volume and image
    // const volumeDir = `${process.env.DOCKER_VOLUMES_PATH}/${volumeName}`;

    // Create Bind Volume from a local directory
    


    // Spawn Docker container with the specified volume and image
    // const proc = pty.spawn('docker', ['run', 
      // "--rm", "-ti", 
      // "--user", `${uid}`,
      // "-v", `${volumeName}:/app`, 
      // "custom-python", "bash"], {})

    const executeSilentCommand = (command: string) => {
        isOutputEnabled = false;
        proc.write(command);
        
        setTimeout(() => {
            isOutputEnabled = true;
        }, 1000)
    }

    setTimeout(() => {
        executeSilentCommand(`echo -e '${code}' > /app/code.py \r`);
        // executeSilentCommand(`chmod -R 777 /app/ \r`);
    }, 3000);

    // Emit output to the client
    const onData = proc.onData((output) => {
        // console.log("Process Received Data: ", output);
        if (isOutputEnabled) {
          client.emit('output', output);
        }
    });

    // Receive input from the client
    client.on('input', (inputData) => {
        proc.write(inputData);
    });

    client.on('updateFileData', async (diffs) => {
        const filePath = `${process.env.DOCKER_VOLUMES_PATH}/${volumeName}/code.py`;
        await this.filesystemService.updateFile(filePath, diffs);
    });

    const exit = proc.onExit(() => {
        console.log("Process exited");
        onData.dispose();
        exit.dispose();
    });

    // Store the process for cleanup on disconnect
    this.clientProcesses.set(client.id, proc);
  }
}