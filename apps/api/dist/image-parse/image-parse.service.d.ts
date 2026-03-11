import { ConfigService } from '@nestjs/config';
export declare class ImageParseService {
    private readonly configService;
    private readonly logger;
    private readonly supabase;
    private readonly bucket;
    constructor(configService: ConfigService);
    uploadImageAsWebp(imageUrl: string, path: string): Promise<string>;
    uploadFileAsWebp(file: Express.Multer.File, path: string): Promise<string>;
}
