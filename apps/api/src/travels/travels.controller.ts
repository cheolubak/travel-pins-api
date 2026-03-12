import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { RequiredAuthGuard } from '../auth/required-auth.guard';
import { CreateTravelDto } from './dto/create-travel.dto';
import { QueryTravelDto } from './dto/query-travel.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';
import { TravelsService } from './travels.service';

@Controller('travels')
@UseGuards(RequiredAuthGuard)
export class TravelsController {
  constructor(private readonly travelsService: TravelsService) {}

  @Post()
  createTravel(@Request() req, @Body() dto: CreateTravelDto) {
    return this.travelsService.createTravel(req.user.id, dto);
  }

  @Get()
  getTravels(@Request() req, @Query() query: QueryTravelDto) {
    return this.travelsService.getTravels(req.user.id, query);
  }

  @Get(':id')
  getTravel(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.travelsService.getTravel(req.user.id, id);
  }

  @Patch(':id')
  updateTravel(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTravelDto,
  ) {
    return this.travelsService.updateTravel(req.user.id, id, dto);
  }

  @Delete(':id')
  deleteTravel(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.travelsService.deleteTravel(req.user.id, id);
  }
}
