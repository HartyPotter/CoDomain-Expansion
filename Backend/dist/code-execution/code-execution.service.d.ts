import { WebSocketServer } from 'ws';
export declare class CodeExecutionService {
    private wss;
    createVolume(volumeName: string): Promise<void>;
    openProject(volume: string, image: string): Promise<any>;
    closeProject(projectId: string, wss: WebSocketServer, proc: any): void;
}
