import {Injectable} from "@nestjs/common";

@Injectable()
export class TokenBlacklistService {
    private readonly blacklist: Set<string> = new Set();

    addToBlacklist(token: string) {
        this.blacklist.add(token);
    }

    isBlacklisted(token: string): boolean {
        return this.blacklist.has(token);
    }
}