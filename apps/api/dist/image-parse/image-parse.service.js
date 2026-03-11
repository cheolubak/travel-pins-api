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
var ImageParseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageParseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const sharp = require("sharp");
let ImageParseService = ImageParseService_1 = class ImageParseService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(ImageParseService_1.name);
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseKey = this.configService.get('SUPABASE_ANON_KEY');
        this.bucket =
            this.configService.get('SUPABASE_STORAGE_BUCKET') || '';
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be configured');
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    async uploadImageAsWebp(imageUrl, path) {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }
        const buffer = Buffer.from(await response.arrayBuffer());
        const webpBuffer = await sharp(buffer)
            .resize({ width: 1024, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();
        const filePath = path.endsWith('.webp') ? path : `${path}.webp`;
        const { error } = await this.supabase.storage
            .from(this.bucket)
            .upload(filePath, webpBuffer, {
            contentType: 'image/webp',
            upsert: true,
        });
        if (error) {
            this.logger.error(`Failed to upload image to Supabase: ${error.message}`);
            throw new Error(`Failed to upload image: ${error.message}`);
        }
        const { data } = this.supabase.storage
            .from(this.bucket)
            .getPublicUrl(filePath);
        this.logger.log(`Image uploaded successfully: ${data.publicUrl}`);
        return filePath;
    }
    async uploadFileAsWebp(file, path) {
        const webpBuffer = await sharp(file.buffer)
            .resize({ width: 1024, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();
        const filePath = path.endsWith('.webp') ? path : `${path}.webp`;
        const { error } = await this.supabase.storage
            .from(this.bucket)
            .upload(filePath, webpBuffer, {
            contentType: 'image/webp',
            upsert: true,
        });
        if (error) {
            this.logger.error(`Failed to upload image to Supabase: ${error.message}`);
            throw new Error(`Failed to upload image: ${error.message}`);
        }
        const { data } = this.supabase.storage
            .from(this.bucket)
            .getPublicUrl(filePath);
        this.logger.log(`Image uploaded successfully: ${data.publicUrl}`);
        return filePath;
    }
};
exports.ImageParseService = ImageParseService;
exports.ImageParseService = ImageParseService = ImageParseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ImageParseService);
//# sourceMappingURL=image-parse.service.js.map