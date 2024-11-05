import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as pty from 'node-pty';

const code = "import datetime; print(datetime.date.today())"
let isOutputEnabled = true;


@Injectable()
@WebSocketGateway({ namespace: '/code-execution', cors: { origin: '*' } })
export class CodeExecutionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private clientProcesses = new Map<string, any>();


  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
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
    @MessageBody() data: { volume: string; image: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { volume, image } = data;

    // Spawn Docker container with the specified volume and image
    const proc = pty.spawn('docker', ['run', "--rm", "-ti", "-v", `${volume}:/app`, "python:3.9-slim", "bash"], {})

    const executeSilentCommand = (command: string) => {
        isOutputEnabled = false;
        proc.write(command);
        
        setTimeout(() => {
            isOutputEnabled = true;
        }, 1000)
    }

    setTimeout(() => {
        executeSilentCommand(`echo \"${code}\" >> /app/code.py \r`);
    }, 2000);

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

    const exit = proc.onExit(() => {
        console.log("Process exited");
        onData.dispose();
        exit.dispose();
    });

    // Store the process for cleanup on disconnect
    this.clientProcesses.set(client.id, proc);
  }
}