import { Body, Controller, Post } from '@nestjs/common';

import { RegisterPlaceDto } from './dto/register-place.dto';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private readonly placeService: PlacesService) {}

  @Post()
  registerPlaces(@Body() dto: RegisterPlaceDto) {
    return this.placeService.registerPlaces(dto);
  }
}
