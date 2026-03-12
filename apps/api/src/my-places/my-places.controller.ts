import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { RequiredAuthGuard } from '../auth/required-auth.guard';
import { MyPlacesService } from './my-places.service';

@Controller('my-places')
@UseGuards(RequiredAuthGuard)
export class MyPlacesController {
  constructor(private readonly myPlacesService: MyPlacesService) {}

  @Get()
  getMyPlaces(@Request() req) {
    return this.myPlacesService.getMyPlaces(req.user.id);
  }

  @Post(':placeId')
  savePlace(@Request() req, @Param('placeId', ParseUUIDPipe) placeId: string) {
    return this.myPlacesService.savePlace(req.user.id, placeId);
  }

  @Delete(':placeId')
  unsavePlace(
    @Request() req,
    @Param('placeId', ParseUUIDPipe) placeId: string,
  ) {
    return this.myPlacesService.unsavePlace(req.user.id, placeId);
  }
}
