import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class CodeExecutionGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private clientProcesses;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleStart(data: {
        volume: string;
        image: string;
    }, client: Socket): void;
}
