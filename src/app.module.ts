import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ImageParseModule } from './image-parse/image-parse.module';
import { PlacesModule } from './places/places.module';

@Module({
  controllers: [AppController],
  imports: [
    DatabaseModule,
    ImageParseModule,
    PlacesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  providers: [AppService],
})
export class AppModule {}
