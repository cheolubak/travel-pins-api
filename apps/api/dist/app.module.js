"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const database_1 = require("@travel-pins/database");
const path = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const image_parse_module_1 = require("./image-parse/image-parse.module");
const my_places_module_1 = require("./my-places/my-places.module");
const places_module_1 = require("./places/places.module");
const reviews_module_1 = require("./reviews/reviews.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [app_controller_1.AppController],
        imports: [
            database_1.DatabaseModule,
            image_parse_module_1.ImageParseModule,
            places_module_1.PlacesModule,
            my_places_module_1.MyPlacesModule,
            reviews_module_1.ReviewsModule,
            config_1.ConfigModule.forRoot({
                envFilePath: path.resolve(__dirname, '../../../.env'),
                isGlobal: true,
            }),
            auth_module_1.AuthModule,
            jwt_1.JwtModule.registerAsync({
                global: true,
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    return {
                        secret: configService.get('JWT_SECRET'),
                        signOptions: { expiresIn: '1h' },
                    };
                },
            }),
        ],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map