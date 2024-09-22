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
    async validateCredentials(username, input_password) {
        const user = await this.userService.findByUsername(username);
        if (!user) {
            throw new common_1.NotFoundException('User with the provided username was not found');
        }
        if (!await bcrypt.compare(input_password, user.password)) {
            throw new common_1.UnauthorizedException('Invalid password. Please try again');
        }
        const { password, ...result } = user;
        return result;
    }
    async signUp(first_name, last_name, age, username, email, password) {
        if (await this.userService.findByUsername(username)) {
            throw new Error('This username is already taken');
        }
        if (await this.userService.findByEmail(email)) {
            throw new Error('This email is already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userService.create({
            first_name,
            last_name,
            age,
            username,
            email,
            password: hashedPassword
        });
        if (!user) {
            throw new Error('User creation failed');
        }
        return await this.login(username, password);
    }
    async login(username, password) {
        const user = await this.validateCredentials(username, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid login attempt. Try again.');
        }
        const redis = await this.Redis.getClient();
        const accessToken = await this.generateAcessToken(username, user.id.toString());
        await redis.set(`token:${accessToken}`, user.id, { 'EX': 60 });
        const userFlattened = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            username: user.username,
            email: user.email
        };
        await redis.hSet(`user:${user.id}`, userFlattened);
        await redis.expire(`user:${user.id}`, 60);
        return {
            accessToken
        };
    }
    async logout(req) {
        const redis = await this.Redis.getClient();
        await redis.del(`user:${req.user.id}`);
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