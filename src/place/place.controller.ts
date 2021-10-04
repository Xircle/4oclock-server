import { GetPlaceParticipantListOutput } from './dtos/get-place-participant-list.dto';
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
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetPlacesByLocationOutput } from './dtos/get-place-by-location.dto';
import { Roles } from 'src/auth/roles.decorator';
import { GetPlaceByIdOutput } from './dtos/get-place-by-id.dto';
import { CoreOutput } from 'src/common/common.interface';
import { EditPlaceInput } from './dtos/edit-place.dto';

@ApiTags('Place')
@ApiBearerAuth('jwt')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('place')
export class PlaceController {
  constructor(private placeService: PlaceService) {}

  @Get('')
  @ApiOperation({ summary: '위치별 생성된 장소 보기' })
  async getPlacesByLocation(
    @GetUser() anyUser: User | undefined,
    @Query('location') location: string,
    @Query('page', ParseIntPipe) page: number,
  ): Promise<GetPlacesByLocationOutput> {
    return this.placeService.getPlacesByLocation(anyUser, location, page);
  }

  @Get(':placeId')
  @ApiOperation({ summary: '장소의 세부정보 보기' })
  async getPlaceById(
    @GetUser() anyUser: User | undefined,
    @Param('placeId', new ParseUUIDPipe()) placeId: string,
  ): Promise<GetPlaceByIdOutput> {
    return this.placeService.getPlaceById(anyUser, placeId);
  }

  @Post('')
  @ApiOperation({ summary: '장소 생성하기' })
  @ApiCreatedResponse({ description: '장소가 성공적으로 생성됨.' })
  @Roles(['Admin', 'Owner'])
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'coverImage',
        maxCount: 1,
      },
      {
        name: 'reviewImages',
        maxCount: 12,
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

  // @Roles(['Admin', 'Owner', 'Any'])
  @Patch('/:placeId')
  @ApiOperation({ summary: '장소 정보 수정하기' })
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'coverImage',
        maxCount: 1,
      },
    ]),
  )
  @Delete('/:placeId')
  @ApiOperation({ summary: '장소 제거하기' })
  @Roles(['Admin'])
  async deletePlace(
    @Param('placeId') placeId: string,
  ): Promise<DeletePlaceOutput> {
    return this.placeService.deletePlace(placeId);
  }

  @Get('/:placeId/participants')
  @ApiOperation({ summary: '해당 장소에 예약한 참가자 리스트 보기' })
  async getPlaceParticipantList(
    @Param('placeId') placeId: string,
  ): Promise<GetPlaceParticipantListOutput> {
    return this.placeService.getPlaceParticipantList(placeId);
  }
}
