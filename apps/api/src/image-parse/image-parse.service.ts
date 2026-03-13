import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as sharp from 'sharp';

@Injectable()
export class ImageParseService {
  private readonly logger = new Logger(ImageParseService.name);
  private readonly supabase: SupabaseClient;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    this.bucket =
      this.configService.get<string>('SUPABASE_STORAGE_BUCKET') || '';

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be configured');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * 이미지 URL을 받아서 webp로 변환 후 Supabase Storage에 저장합니다.
   * @param imageUrl 원본 이미지 URL
   * @param path 저장할 경로 (예: 'posts/my-image')  확장자 없이 전달하면 .webp가 자동 추가됩니다.
   * @returns 저장된 이미지의 public URL
   */
  private validateUrl(url: string): void {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      throw new Error(`Invalid URL: ${url}`);
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error(`Unsupported protocol: ${parsed.protocol}`);
    }

    const hostname = parsed.hostname;
    const privatePatterns = [
      /^localhost$/i,
      /^127\./,
      /^10\./,
      /^172\.(1[6-9]|2\d|3[01])\./,
      /^192\.168\./,
      /^169\.254\./,
      /^0\./,
      /^\[::1\]$/,
      /^\[fc/i,
      /^\[fd/i,
      /^\[fe80:/i,
    ];

    for (const pattern of privatePatterns) {
      if (pattern.test(hostname)) {
        throw new Error(`Access to private network is not allowed: ${hostname}`);
      }
    }
  }

  async uploadImageAsWebp(imageUrl: string, path: string): Promise<string> {
    this.validateUrl(imageUrl);

    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`,
      );
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

  /**
   * Express.Multer.File을 받아서 webp로 변환 후 Supabase Storage에 저장합니다.
   * @param file Express.Multer.File 객체
   * @param path 저장할 경로 (예: 'posts/my-image')  확장자 없이 전달하면 .webp가 자동 추가됩니다.
   * @returns 저장된 이미지의 public URL
   */
  async uploadFileAsWebp(
    file: Express.Multer.File,
    path: string,
  ): Promise<string> {
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
}
