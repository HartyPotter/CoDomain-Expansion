import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';

// Import pty using require if import is not working
const pty = require('node-pty');


@Injectable()
export class CodeExecutionService {
    
    async createVolume(volumeName: string) {
        try {
            pty.spawn('docker', ['volume', 'create', '--name', volumeName]);
        }
        catch {
            console.log("Couldn't create volume")
        }
    }
}
