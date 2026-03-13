import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';
import { RequiredAuthGuard } from '../auth/required-auth.guard';
import { QueryPlaceDto } from './dto/query-place.dto';
import { RegisterPlaceDto } from './dto/register-place.dto';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private readonly placeService: PlacesService) {}

  @Get()
  @UseGuards(AuthGuard)
  getPlaces(@Query() query: QueryPlaceDto) {
    return this.placeService.getPlaces(query);
  }

  @Post()
  @UseGuards(RequiredAuthGuard)
  registerPlaces(@Body() dto: RegisterPlaceDto) {
    return this.placeService.registerPlaces(dto);
  }
}
