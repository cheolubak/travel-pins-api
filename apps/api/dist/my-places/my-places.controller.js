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
exports.MyPlacesController = void 0;
const common_1 = require("@nestjs/common");
const required_auth_guard_1 = require("../auth/required-auth.guard");
const my_places_service_1 = require("./my-places.service");
let MyPlacesController = class MyPlacesController {
    constructor(myPlacesService) {
        this.myPlacesService = myPlacesService;
    }
    getMyPlaces(req) {
        return this.myPlacesService.getMyPlaces(req.user.id);
    }
    savePlace(req, placeId) {
        return this.myPlacesService.savePlace(req.user.id, placeId);
    }
    unsavePlace(req, placeId) {
        return this.myPlacesService.unsavePlace(req.user.id, placeId);
    }
};
exports.MyPlacesController = MyPlacesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MyPlacesController.prototype, "getMyPlaces", null);
__decorate([
    (0, common_1.Post)(':placeId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('placeId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MyPlacesController.prototype, "savePlace", null);
__decorate([
    (0, common_1.Delete)(':placeId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('placeId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MyPlacesController.prototype, "unsavePlace", null);
exports.MyPlacesController = MyPlacesController = __decorate([
    (0, common_1.Controller)('my-places'),
    (0, common_1.UseGuards)(required_auth_guard_1.RequiredAuthGuard),
    __metadata("design:paramtypes", [my_places_service_1.MyPlacesService])
], MyPlacesController);
//# sourceMappingURL=my-places.controller.js.map