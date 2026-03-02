import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

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
