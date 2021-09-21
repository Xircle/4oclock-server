import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { DeletePlaceOutput } from './dtos/delete-place.dto';
import { User } from './../user/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { RolesGuard } from './../auth/guard/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreatePlaceInput, CreatePlaceOutput } from './dtos/create-place.dto';
import { PlaceService } from './place.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
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
  @UseGuards(AuthGuard('jwt'))
  async getPlacesByLocation(
    @GetUser() anyUser: User | undefined,
    @Query('location') location: string,
    @Query('page', ParseIntPipe) page: number,
  ): Promise<GetPlacesByLocationOutput> {
    return this.placeService.getPlacesByLocation(anyUser, location, page);
  }

  @Get(':placeId')
  @UseGuards(AuthGuard('jwt'))
  async getPlaceById(
    @GetUser() anyUser: User | undefined,
    @Param('placeId', new ParseUUIDPipe()) placeId: string,
  ) {
    return this.placeService.getPlaceById(anyUser, placeId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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
    @GetUser() authUser: User,
    @Body() createPlaceInput: CreatePlaceInput,
    @UploadedFiles()
    files: {
      coverImage: Express.Multer.File[];
      reviewImages: Express.Multer.File[];
    },
  ): Promise<CreatePlaceOutput> {
    return this.placeService.createPlace(authUser, createPlaceInput, files);
  }

  @Delete('/:placeId')
  @UseGuards(RolesGuard)
  @Roles(['Admin'])
  async deletePlace(
    @Param('placeId') placeId: string,
  ): Promise<DeletePlaceOutput> {
    return this.placeService.deletePlace(placeId);
  }
}
