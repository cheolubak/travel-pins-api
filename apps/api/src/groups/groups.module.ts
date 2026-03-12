import { Module } from '@nestjs/common';
import { DatabaseModule } from '@travel-pins/database';

import { AuthModule } from '../auth/auth.module';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  controllers: [GroupsController],
  imports: [DatabaseModule, AuthModule],
  providers: [GroupsService],
})
export class GroupsModule {}
