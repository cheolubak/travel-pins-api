import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '@travel-pins/database';
import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ImageParseModule } from './image-parse/image-parse.module';
import { MyPlacesModule } from './my-places/my-places.module';
import { PlacesModule } from './places/places.module';

@Module({
  controllers: [AppController],
  imports: [
    DatabaseModule,
    ImageParseModule,
    PlacesModule,
    MyPlacesModule,
    ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '../../../.env'),
      isGlobal: true,
    }),
    AuthModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
