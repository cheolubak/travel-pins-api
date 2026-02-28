import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { QueryPlaceDto } from './dto/query-place.dto';
import { RegisterPlaceDto } from './dto/register-place.dto';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private readonly placeService: PlacesService) {}

  @Get()
  getPlaces(@Query() query: QueryPlaceDto) {
    return this.placeService.getPlaces(query);
  }

  @Post()
  registerPlaces(@Body() dto: RegisterPlaceDto) {
    return this.placeService.registerPlaces(dto);
  }
}
