import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';

// Import pty using require if import is not working
const pty = require('node-pty');


@Injectable()
export class CodeExecutionService {
    
    async createVolume(volumeName: string) {
        try {
            // const uid = process.getuid();
            // const gid = process.getgid();

             // Create Regular Docker Volume
            // pty.spawn('docker', ['volume', 'create', 
            //     '--opt', 'type=none',
            //     '--opt', `${process.env.DOCKER_VOLUMES_PATH}/${volumeName}`,
            //     '--opt', `o=bind,uid=${uid},gid=${gid}`,
            //     '--name', volumeName]);
            //  const uid = process.getuid();
            //  pty.spawn(`sudo chown -R ${uid}:${uid} /var/lib/docker/volumes/${volumeName}/_data`);
            
            // Create Directory
            const volumeDir = `${process.env.DOCKER_VOLUMES_PATH}/${volumeName}`;
            spawn('mkdir', [volumeDir], {});
            
            // Create Bind Volume from a local directory
            // const command = `docker volume create --driver local --opt type=none 
                                // --opt device=${volumeDir} --opt o=bind ${volumeName}`;
            

            // We will run the container with a bind volume instead of creating a docker volume

        }
        catch {
            console.log("Couldn't create volume")
        }
    }
}
