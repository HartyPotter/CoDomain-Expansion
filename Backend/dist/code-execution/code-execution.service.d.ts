export declare class CodeExecutionService {
    private readonly pistonAPI;
    executeCode(code: string, language: string, version: string): Promise<{
        output: string;
    }>;
}
