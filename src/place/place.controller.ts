import { RolesGuard } from '../auth/guard/roles.guard';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { CreatePlaceInput, CreatePlaceOutput } from './dtos/create-place.dto';
import { PlaceService } from './place.service';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetPlacesByLocationOutput } from './dtos/get-place-by-location.dto';
import { Roles } from 'src/auth/roles.decorator';

@Controller('place')
export class PlaceController {
  constructor(private placeService: PlaceService) {}

  @Get()
  async getPlacesByAround(
    @Query('location') location: string,
    @Query('page', ParseIntPipe) page: number,
  ): Promise<GetPlacesByLocationOutput> {
    return this.placeService.getPlacesByLocation(location, page);
  }

  @Get(':placeId')
  async getPlaceById(@Param('placeId', new ParseUUIDPipe()) placeId: string) {
    return this.placeService.getPlaceById(placeId);
  }

  @Post('')
  @UseGuards(RolesGuard)
  @Roles(['Admin', 'Owner'])
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'coverImage',
        maxCount: 1,
      },
      {
        name: 'reviewImages',
        maxCount: 6,
      },
    ]),
  )
  async createPlace(
    @Body() createPlaceInput: CreatePlaceInput,
    @UploadedFiles()
    files: {
      coverImage: Express.Multer.File;
      reviewImages: Express.Multer.File[];
    },
  ): Promise<CreatePlaceOutput> {
    return this.placeService.createPlace(createPlaceInput, files);
  }
}
