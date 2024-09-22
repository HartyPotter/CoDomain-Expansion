import { RedisService } from 'src/redis/redis.service';
export interface RedisUser {
    id: string;
    first_name: string;
    last_name: string;
    age: string;
    username: string;
    email: string;
}
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private Redis;
    constructor(Redis: RedisService);
    validate(payload: any): Promise<RedisUser>;
}
export {};
