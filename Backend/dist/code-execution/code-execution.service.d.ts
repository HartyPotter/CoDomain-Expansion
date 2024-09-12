export declare class CodeExecutionService {
    startContainer(): Promise<void>;
    executeCode(code: string, language: string, version: string): Promise<{
        output: string;
    }>;
    executeTerminal(command: string): Promise<{
        output: string;
    }>;
}
