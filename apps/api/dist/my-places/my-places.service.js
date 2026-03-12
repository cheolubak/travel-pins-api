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
exports.MyPlacesService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@travel-pins/database");
let MyPlacesService = class MyPlacesService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async getMyPlaces(userId) {
        return this.prismaService.myPlaces.findMany({
            relationLoadStrategy: 'join',
            select: {
                createdAt: true,
                place: {
                    select: {
                        address: true,
                        category: {
                            select: {
                                name: true,
                            },
                        },
                        id: true,
                        lat: true,
                        lng: true,
                        name: true,
                        thumbnail: true,
                        type: true,
                    },
                },
            },
            where: { userId },
        });
    }
    async savePlace(userId, placeId) {
        const place = await this.prismaService.places.findUnique({
            where: { id: placeId },
        });
        if (!place) {
            throw new common_1.NotFoundException('Place not found');
        }
        const existing = await this.prismaService.myPlaces.findUnique({
            where: { placeId_userId: { placeId, userId } },
        });
        if (existing) {
            throw new common_1.ConflictException('Place already saved');
        }
        return this.prismaService.myPlaces.create({
            data: { placeId, userId },
        });
    }
    async unsavePlace(userId, placeId) {
        const existing = await this.prismaService.myPlaces.findUnique({
            where: { placeId_userId: { placeId, userId } },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Saved place not found');
        }
        return this.prismaService.myPlaces.delete({
            where: { placeId_userId: { placeId, userId } },
        });
    }
};
exports.MyPlacesService = MyPlacesService;
exports.MyPlacesService = MyPlacesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], MyPlacesService);
//# sourceMappingURL=my-places.service.js.map