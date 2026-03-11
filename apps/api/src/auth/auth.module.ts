import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@travel-pins/database';

import { ImageParseModule } from '../image-parse/image-parse.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  exports: [AuthService, AuthGuard],
  imports: [HttpModule, DatabaseModule, ImageParseModule],
  providers: [AuthService, AuthGuard],
})
export class AuthModule {}
