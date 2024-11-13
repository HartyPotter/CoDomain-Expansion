import { CodeExecutionService } from './code-execution.service';
export declare class CodeExecutionController {
    private readonly codeExecutionService;
    constructor(codeExecutionService: CodeExecutionService);
    createVolume(volumeName: string): Promise<void>;
}
