import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';

// Import pty using require if import is not working
const pty = require('node-pty');


@Injectable()
export class CodeExecutionService {
    
    async createVolume(volumeName: string) {
        try {
             // Create Regular Docker Volume
             pty.spawn('docker', ['volume', 'create', '--name', volumeName]);
            
            // Create Directory
            // const volumeDir = `${process.env.DOCKER_VOLUMES_PATH}/${volumeName}`;
            // pty.spawn('mkdir', [volumeDir], {});
            
            // Create Bind Volume from a local directory
            // const command = `docker volume create --driver local --opt type=none 
            //                     --opt device=${volumeDir} --opt o=bind ${volumeName}`;
            

            // We will run the container with a bind volume instead of creating a docker volume

        }
        catch {
            console.log("Couldn't create volume")
        }
    }
}
