import { Module } from '@nestjs/common';
import { DatabaseModule } from '@travel-pins/database';

import { AuthModule } from '../auth/auth.module';
import { MyPlacesController } from './my-places.controller';
import { MyPlacesService } from './my-places.service';

@Module({
  controllers: [MyPlacesController],
  imports: [DatabaseModule, AuthModule],
  providers: [MyPlacesService],
})
export class MyPlacesModule {}
