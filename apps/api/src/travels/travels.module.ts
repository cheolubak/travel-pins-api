import { Module } from '@nestjs/common';
import { DatabaseModule } from '@travel-pins/database';

import { AuthModule } from '../auth/auth.module';
import { TravelsController } from './travels.controller';
import { TravelsService } from './travels.service';

@Module({
  controllers: [TravelsController],
  imports: [DatabaseModule, AuthModule],
  providers: [TravelsService],
})
export class TravelsModule {}
