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
exports.GroupsController = void 0;
const common_1 = require("@nestjs/common");
const required_auth_guard_1 = require("../auth/required-auth.guard");
const add_member_dto_1 = require("./dto/add-member.dto");
const create_group_dto_1 = require("./dto/create-group.dto");
const update_group_dto_1 = require("./dto/update-group.dto");
const groups_service_1 = require("./groups.service");
let GroupsController = class GroupsController {
    constructor(groupsService) {
        this.groupsService = groupsService;
    }
    createGroup(req, dto) {
        return this.groupsService.createGroup(req.user.id, dto);
    }
    getMyGroups(req) {
        return this.groupsService.getMyGroups(req.user.id);
    }
    getGroup(req, id) {
        return this.groupsService.getGroup(req.user.id, id);
    }
    updateGroup(req, id, dto) {
        return this.groupsService.updateGroup(req.user.id, id, dto);
    }
    deleteGroup(req, id) {
        return this.groupsService.deleteGroup(req.user.id, id);
    }
    addMember(req, id, dto) {
        return this.groupsService.addMember(req.user.id, id, dto);
    }
    removeMember(req, id, userId) {
        return this.groupsService.removeMember(req.user.id, id, userId);
    }
};
exports.GroupsController = GroupsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_group_dto_1.CreateGroupDto]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "createGroup", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "getMyGroups", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "getGroup", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_group_dto_1.UpdateGroupDto]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "updateGroup", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "deleteGroup", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_member_dto_1.AddMemberDto]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "addMember", null);
__decorate([
    (0, common_1.Delete)(':id/members/:userId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "removeMember", null);
exports.GroupsController = GroupsController = __decorate([
    (0, common_1.Controller)('groups'),
    (0, common_1.UseGuards)(required_auth_guard_1.RequiredAuthGuard),
    __metadata("design:paramtypes", [groups_service_1.GroupsService])
], GroupsController);
//# sourceMappingURL=groups.controller.js.map