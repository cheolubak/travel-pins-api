import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { ImageParseModule } from '../image-parse/image-parse.module';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';

@Module({
  controllers: [PlacesController],
  imports: [DatabaseModule, ImageParseModule],
  providers: [PlacesService],
})
export class PlacesModule {}
