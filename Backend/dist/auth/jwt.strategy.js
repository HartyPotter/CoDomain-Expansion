"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const redis_service_1 = require("../redis/redis.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(Redis) {
        const cookieExtractor = (req) => {
            let token = null;
            if (req && req.cookies) {
                token = req.cookies['accessToken'];
            }
            return token;
        };
        super({
            jwtFromRequest: cookieExtractor,
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_TOKEN_SECRET,
            passReqToCallback: true,
        });
        this.Redis = Redis;
    }
    async validate(req, payload) {
        const token = req.cookies?.accessToken;
        console.log("Token from validate: ", token);
        const redis = await this.Redis.getClient();
        const user = await redis.hGetAll(`user:${token}`);
        if (!user || Object.keys(user).length === 0) {
            throw new common_1.UnauthorizedException("User not logged in.");
        }
        if (user.id != payload.sub) {
            throw new common_1.UnauthorizedException("Wrong token.");
        }
        const req_w_user = {
            id: payload.sub,
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            username: user.username,
            email: user.email,
        };
        return req_w_user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map