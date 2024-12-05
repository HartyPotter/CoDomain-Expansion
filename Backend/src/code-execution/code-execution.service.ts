import { Injectable } from '@nestjs/common';
import { FilesystemService } from 'src/filesystem/filesystem.service';
import { CODE_SNIPPETS, FILE_EXTENSIONS } from './constants';


@Injectable()
export class CodeExecutionService {
    constructor(private readonly filesystemService: FilesystemService) {}

    async createVolume(volumeName: string, image: string) {
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
            image = image.toLowerCase();
            
            // Create Directory
            await this.filesystemService.createDir(volumeName, process.env.DOCKER_VOLUMES_PATH);
            
            // Get starter code
            await this.filesystemService.createFile(`main.${FILE_EXTENSIONS[image]}`, 
                `${process.env.DOCKER_VOLUMES_PATH}/${volumeName}`, 
                CODE_SNIPPETS[image]);
            
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
