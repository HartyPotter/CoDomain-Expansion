export declare class TokenBlacklistService {
    private readonly blacklist;
    addToBlacklist(token: string): void;
    isBlacklisted(token: string): boolean;
}
