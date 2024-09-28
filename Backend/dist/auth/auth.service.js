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
exports.AuthService = void 0;
const bcrypt = require("bcryptjs");
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const redis_service_1 = require("../redis/redis.service");
let AuthService = class AuthService {
    constructor(userService, jwtService, Redis) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.Redis = Redis;
    }
    async generateAcessToken(username, userID) {
        const payload = { sub: userID, username: username };
        return await this.jwtService.signAsync(payload);
    }
    async validateCredentials(loginUserDto) {
        const user = await this.userService.findByUsername(loginUserDto.username);
        if (!user) {
            throw new common_1.NotFoundException('User with the provided username was not found');
        }
        if (!await bcrypt.compare(loginUserDto.password, user.password)) {
            throw new common_1.UnauthorizedException('Invalid password. Please try again');
        }
        const { password, createdAt, updatedAt, ...result } = user;
        return result;
    }
    async register(registerUserDto) {
        if (await this.userService.findByUsername(registerUserDto.username)) {
            return null;
        }
        if (await this.userService.findByEmail(registerUserDto.email)) {
            return null;
        }
        const password = await bcrypt.hash(registerUserDto.password, 10);
        const user = this.userService.create({ ...registerUserDto, password });
        if (!user) {
            throw new Error('User creation failed');
        }
        return user;
    }
    async login(loginUserDto) {
        const user = await this.validateCredentials(loginUserDto);
        if (!user) {
            throw new common_1.HttpException("Invalid login attempt. Try again.", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const accessToken = await this.generateAcessToken(loginUserDto.username, user.id.toString());
        console.log("Access Token: ", accessToken);
        const redis = await this.Redis.getClient();
        await redis.hSet(`user:${accessToken}`, user);
        await redis.expire(`user:${accessToken}`, 7 * 24 * 60 * 60);
        return {
            user,
            accessToken
        };
    }
    async logout(token) {
        const redis = await this.Redis.getClient();
        try {
            await redis.del(`user:${token}`);
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        redis_service_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map