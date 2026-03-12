import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { RequiredAuthGuard } from '../auth/required-auth.guard';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupsService } from './groups.service';

@Controller('groups')
@UseGuards(RequiredAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  createGroup(@Request() req, @Body() dto: CreateGroupDto) {
    return this.groupsService.createGroup(req.user.id, dto);
  }

  @Get()
  getMyGroups(@Request() req) {
    return this.groupsService.getMyGroups(req.user.id);
  }

  @Get(':id')
  getGroup(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.groupsService.getGroup(req.user.id, id);
  }

  @Patch(':id')
  updateGroup(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGroupDto,
  ) {
    return this.groupsService.updateGroup(req.user.id, id, dto);
  }

  @Delete(':id')
  deleteGroup(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.groupsService.deleteGroup(req.user.id, id);
  }

  @Post(':id/members')
  addMember(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddMemberDto,
  ) {
    return this.groupsService.addMember(req.user.id, id, dto);
  }

  @Delete(':id/members/:userId')
  removeMember(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.groupsService.removeMember(req.user.id, id, userId);
  }
}
