import { CodeExecutionService } from './code-execution.service';
export declare class CodeExecutionController {
    private readonly codeExecutionService;
    constructor(codeExecutionService: CodeExecutionService);
    executeCode(code: string, lang: string, version: string): Promise<{
        output: string;
    }>;
    executeTerminal(command: string): Promise<{
        output: string;
    }>;
}
