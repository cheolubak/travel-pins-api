import { Module } from '@nestjs/common';
import { DatabaseModule } from '@travel-pins/database';

import { AuthModule } from '../auth/auth.module';
import { ImageParseModule } from '../image-parse/image-parse.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  imports: [DatabaseModule, AuthModule, ImageParseModule],
  providers: [UsersService],
})
export class UsersModule {}
