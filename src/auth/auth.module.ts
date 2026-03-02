import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
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
