export declare class CodeExecutionService {
    executeCode(code: string, language: string, version: string): Promise<{
        output: string;
    }>;
}
