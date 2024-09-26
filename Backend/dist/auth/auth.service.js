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
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.blacklist = new Set();
    }
    async login(username, password) {
        if (!username || !password) {
            throw new Error('Please complete all the required fields');
        }
        const user = await this.userService.findUsername(username);
        if (user && await bcrypt.compare(password, user.password)) {
            const payload = { username: user.username, sub: user.id };
            return {
                accessToken: await this.jwtService.signAsync(payload),
            };
        }
        return new common_1.UnauthorizedException();
    }
    async signUp(username, email, password) {
        if (!username || !email || !password) {
            throw new Error('Please complete all the required fields');
        }
        if (await this.userService.findUsername(username)) {
            throw new Error('This username is already taken');
        }
        if (await this.userService.findEmail(email)) {
            throw new Error('This email is already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userService.create({
            username: username,
            email: email,
            password: hashedPassword,
            first_name: "placeholder",
            last_name: "placeholder",
            age: 23,
        });
        if (!user) {
            throw new Error('User creation failed');
        }
        return await this.login(username, password);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map