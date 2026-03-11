import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';
import { QueryPlaceDto } from './dto/query-place.dto';
import { RegisterPlaceDto } from './dto/register-place.dto';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private readonly placeService: PlacesService) {}

  @Get()
  @UseGuards(AuthGuard)
  getPlaces(@Request() req, @Query() query: QueryPlaceDto) {
    const user = req.user;

    return this.placeService.getPlaces(query);
  }

  @Post()
  registerPlaces(@Body() dto: RegisterPlaceDto) {
    return this.placeService.registerPlaces(dto);
  }
}
