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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelsController = void 0;
const common_1 = require("@nestjs/common");
const required_auth_guard_1 = require("../auth/required-auth.guard");
const create_travel_dto_1 = require("./dto/create-travel.dto");
const query_travel_dto_1 = require("./dto/query-travel.dto");
const update_travel_dto_1 = require("./dto/update-travel.dto");
const travels_service_1 = require("./travels.service");
let TravelsController = class TravelsController {
    constructor(travelsService) {
        this.travelsService = travelsService;
    }
    createTravel(req, dto) {
        return this.travelsService.createTravel(req.user.id, dto);
    }
    getTravels(req, query) {
        return this.travelsService.getTravels(req.user.id, query);
    }
    getTravel(req, id) {
        return this.travelsService.getTravel(req.user.id, id);
    }
    updateTravel(req, id, dto) {
        return this.travelsService.updateTravel(req.user.id, id, dto);
    }
    deleteTravel(req, id) {
        return this.travelsService.deleteTravel(req.user.id, id);
    }
};
exports.TravelsController = TravelsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_travel_dto_1.CreateTravelDto]),
    __metadata("design:returntype", void 0)
], TravelsController.prototype, "createTravel", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_travel_dto_1.QueryTravelDto]),
    __metadata("design:returntype", void 0)
], TravelsController.prototype, "getTravels", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TravelsController.prototype, "getTravel", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_travel_dto_1.UpdateTravelDto]),
    __metadata("design:returntype", void 0)
], TravelsController.prototype, "updateTravel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TravelsController.prototype, "deleteTravel", null);
exports.TravelsController = TravelsController = __decorate([
    (0, common_1.Controller)('travels'),
    (0, common_1.UseGuards)(required_auth_guard_1.RequiredAuthGuard),
    __metadata("design:paramtypes", [travels_service_1.TravelsService])
], TravelsController);
//# sourceMappingURL=travels.controller.js.map