import { Module } from '@nestjs/common';

import { ImageParseService } from './image-parse.service';

@Module({
  exports: [ImageParseService],
  providers: [ImageParseService],
})
export class ImageParseModule {}
