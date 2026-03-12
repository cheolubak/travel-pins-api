"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelsModule = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@travel-pins/database");
const auth_module_1 = require("../auth/auth.module");
const travels_controller_1 = require("./travels.controller");
const travels_service_1 = require("./travels.service");
let TravelsModule = class TravelsModule {
};
exports.TravelsModule = TravelsModule;
exports.TravelsModule = TravelsModule = __decorate([
    (0, common_1.Module)({
        controllers: [travels_controller_1.TravelsController],
        imports: [database_1.DatabaseModule, auth_module_1.AuthModule],
        providers: [travels_service_1.TravelsService],
    })
], TravelsModule);
//# sourceMappingURL=travels.module.js.map