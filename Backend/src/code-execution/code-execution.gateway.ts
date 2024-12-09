import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as pty from 'node-pty';
import { FilesystemService } from 'src/filesystem/filesystem.service';

// const code = '\ndef greet(name):\n print("Hello, " + name + "!")\n\ngreet("Alex")\n';
let isOutputEnabled = true;


@Injectable()
@WebSocketGateway({ namespace: '/code-execution', cors: { origin: '*' } })
export class CodeExecutionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private clientProcesses = new Map<string, any>();
  private volumeNames = new Map<string, string>();
  private images = new Map<string, string>();
  constructor(private readonly filesystemService: FilesystemService) {}


  async handleConnection(client: Socket)  {
    const volumeName = client.handshake.query.volumeName as string;
    const image = client.handshake.query.image as string;
    this.volumeNames.set(client.id, volumeName);
    this.images.set(client.id, image);

    const proc = pty.spawn('docker', [
      'run', "--rm", "-ti", 
      // "--user", `${process.getuid()}:${process.getgid()}`,
      "--mount", `type=bind,source=${process.env.DOCKER_VOLUMES_PATH}/${volumeName},target=/app`,
      "nixos/nix",
      "bash"], {})

    this.clientProcesses.set(client.id, proc);

    // console.log(`Client connected: ${client.id} with volume ${volumeName} and image ${image}`);
    
    let structure = await this.filesystemService.readDir(`${process.env.DOCKER_VOLUMES_PATH}/${volumeName}`);
    const prefixPath = `${process.env.DOCKER_VOLUMES_PATH}/`;
    structure = structure.map(file => ({
      ...file,
      path: file.path.replace(prefixPath, '')
    }));
    client.emit('connected', structure);
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
    @ConnectedSocket() client: Socket,
  ) {
    // console.log(data);
    const volumeName = this.volumeNames.get(client.id);
    const image = this.images.get(client.id);

    const prefixPath = `${process.env.DOCKER_VOLUMES_PATH}/`;

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

    // setTimeout(() => {
    //     executeSilentCommand(`echo -e '${code}' > /app/code.py \r`);
    //     // executeSilentCommand(`chmod -R 777 /app/ \r`);
    // }, 3000);

    // Emit output to the client
    const onData = proc.onData((output) => {
        if (isOutputEnabled) {
          client.emit('output', output);
        }
    });

    // Receive input from the client
    client.on('input', (inputData) => {
        proc.write(inputData);
    });

    client.on("fetchDir", async (dirPath, callback) => {
        let files = await this.filesystemService.readDir(prefixPath + dirPath);
        files = files.map(file => ({
          ...file,
          path: file.path.replace(prefixPath, '')
        }));
        callback(files);
    });

    client.on("fetchContent", async (filePath, callback) => {
        const content = await this.filesystemService.readFile(prefixPath + filePath);
        callback(content);
    });

    client.on('updateFileData', async (diffs, filePath) => {
        await this.filesystemService.updateFile(prefixPath + filePath, diffs);
    });

    client.on('createFile', async (name, filePath) => {
        console.log("Creating file with name ", name, " at path ", prefixPath + filePath);
        await this.filesystemService.createFile(name, prefixPath + filePath, '');
        client.emit('fileCreated', name);
    })

    client.on('createDir', async (name, dirPath) => {
        await this.filesystemService.createDir(name, prefixPath + dirPath);
        client.emit('dirCreated', name);
    })

    const exit = proc.onExit(() => {
        console.log("Process exited");
        onData.dispose();
        exit.dispose();
    });

    // Store the process for cleanup on disconnect
    this.clientProcesses.set(client.id, proc);
  }
}