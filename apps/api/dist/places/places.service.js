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
exports.PlacesService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@travel-pins/database");
const uuid_1 = require("uuid");
const image_parse_service_1 = require("../image-parse/image-parse.service");
let PlacesService = class PlacesService {
    constructor(prismaService, imageParseService) {
        this.prismaService = prismaService;
        this.imageParseService = imageParseService;
    }
    async getPlaces(query) {
        const { leftBottomLat, leftBottomLng, rightTopLat, rightTopLng } = query;
        return this.prismaService.places.findMany({
            select: {
                address: true,
                category: {
                    select: {
                        name: true,
                    },
                },
                detailAddress: true,
                id: true,
                lat: true,
                lng: true,
                name: true,
                postcode: true,
                thumbnail: true,
                type: true,
            },
            where: {
                lat: {
                    gte: leftBottomLat,
                    lte: rightTopLat,
                },
                lng: {
                    gte: leftBottomLng,
                    lte: rightTopLng,
                },
            },
        });
    }
    async registerPlaces(dto) {
        const { address, categoryId, detailAddress, lat, lng, name, postcode, thumbnail, type, } = dto;
        const category = await this.prismaService.category.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.BadRequestException();
        }
        const placeThumbnail = thumbnail
            ? await this.imageParseService.uploadImageAsWebp(thumbnail, `places/${(0, uuid_1.v4)()}`)
            : null;
        const place = await this.prismaService.places.create({
            data: {
                address,
                categoryId: category.id,
                detailAddress,
                lat,
                lng,
                name,
                postcode,
                thumbnail: placeThumbnail,
                type,
            },
        });
        return place;
    }
};
exports.PlacesService = PlacesService;
exports.PlacesService = PlacesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        image_parse_service_1.ImageParseService])
], PlacesService);
//# sourceMappingURL=places.service.js.map