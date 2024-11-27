import { Injectable } from '@nestjs/common';
import { File } from './file.interface'
import { open, writeFile, mkdir, readFile, unlink, readdir } from 'node:fs/promises';
import { rmSync } from 'node:fs';
const DiffMatchPatch = require('diff-match-patch');

@Injectable()
export class FilesystemService {

    async createFile(name: string, path: string, content: string) {
        try {
            const filePath = `${path}/${name}`;
            await writeFile(filePath, content);
            console.log(`File created at: ${filePath}`);
        } 
        catch (err) {
            console.error('Error creating file:', err);
        }
    }

    async createDir(name: string, path: string) {
        try {
            const dirPath = `${path}/${name}`;
            await mkdir(dirPath, { recursive: true });
            console.log(`Directory created at: ${dirPath}`);
        } 
        catch (err) {
            console.error('Error creating directory:', err);
        }
    }

    async readFile(filePath: string): Promise<string> {
        try {
            const content = await readFile(filePath, 'utf-8');
            console.log(`File read from: ${filePath}`);
            return content;
        } 
        catch (err) {
            console.error('Error reading file:', err);
            throw err;
        }
    }

    async readDir(path: string): Promise<File[]> {
        try {
            const structure = await readdir(path, { withFileTypes: true });
            return structure.map(file => ({
                type: file.isFile() ? 'file' : 'dir',
                name: file.name,
                path: file.parentPath + '/' + file.name
            }));
        }
        catch (err) {
            console.error('Error reading directory:', err);
            throw err;
        }
    }

    async updateFile(filePath: string, diffs: any) {
        const dmp = new DiffMatchPatch();
        
        try {
            const fileHandle = await open(`${filePath}`, 'r+');
            const fileData = await fileHandle.readFile({encoding: 'utf-8'});

            // Compute new text after applying patches
            const [newText, [ success ]] = dmp.patch_apply(diffs, fileData);

            if (success) {
                // write data to file
                await fileHandle.truncate(0); // Clear existing content
                await fileHandle.write(newText, 0, 'utf-8'); // Write the updated content
                console.log("File updated successfully.");
            }
            else {
                console.error("Failed to apply patch.");
            }
            // Close Stream
            fileHandle.close();
        } 
        catch (err) {
            console.error('Error updating file:', err);
        }
    }

    async deleteFile(filePath: string) {
        try {
            await unlink(filePath);
            console.log(`File deleted at: ${filePath}`);
        } 
        catch (err) {
            console.error('Error deleting file:', err);
        }
    }

    async deleteDir(dirPath: string) {
        try {
            await rmSync(dirPath, {recursive: true, force: true});
            console.log(`Directory deleted at: ${dirPath}`);
        } 
        catch (err) {
            console.error('Error deleting directory:', err);
        }
    }
}
