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
exports.RequiredAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
let RequiredAuthGuard = class RequiredAuthGuard {
    constructor(authService) {
        this.authService = authService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { authorization, sessionid } = request.headers;
        if (!authorization || !sessionid) {
            throw new common_1.UnauthorizedException();
        }
        const accessToken = authorization.split(' ').at(1);
        if (!accessToken) {
            throw new common_1.UnauthorizedException();
        }
        try {
            const user = await this.authService.validateTokenUser(accessToken, sessionid);
            if (!user) {
                throw new common_1.UnauthorizedException();
            }
            request.user = user;
            return true;
        }
        catch {
            throw new common_1.UnauthorizedException();
        }
    }
};
exports.RequiredAuthGuard = RequiredAuthGuard;
exports.RequiredAuthGuard = RequiredAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], RequiredAuthGuard);
//# sourceMappingURL=required-auth.guard.js.map