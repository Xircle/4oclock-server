import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { EditPlaceReviewImagesInput } from './dtos/edit-place-review-image.dto';
import { GetPlaceParticipantListOutput } from './dtos/get-place-participant-list.dto';
import {
  CreatePlaceInput,
  CreatePlaceOutput,
  PlacePhotoInput,
} from './dtos/create-place.dto';
import { PlaceService } from './place.service';
import {
  GetPlacesOutput,
  GetPlacesQueryParameter,
} from './dtos/get-places.dto';
import { GetPlaceByIdOutput } from './dtos/get-place-by-id.dto';
import { EditPlaceInput, EditPlacePhotoInput } from './dtos/edit-place.dto';
import { JwtAuthGuard } from '@auth/guard/jwt-auth.guard';
import { GetUser } from '@auth/decorators/get-user.decorator';
import { User } from '@user/entities/user.entity';
import { RolesGuard } from '@auth/guard/roles.guard';
import { Roles } from '@auth/roles.decorator';
import { CoreOutput } from '@common/common.interface';
import { SearchPlaceOutput, SearchPlaceInput } from './dtos/search-place.dto';

@ApiTags('Place')
@ApiBearerAuth('jwt')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@UseGuards(JwtAuthGuard)
@Controller('place')
export class PlaceController {
  constructor(private placeService: PlaceService) {}

  @Get('')
  @ApiOperation({ summary: '장소의 Type, Location 별로 생성된 장소 보기' })
  @UseGuards(RolesGuard)
  @Roles(['Client', 'Admin', 'Owner'])
  async getPlaces(
    @Query() getPlacesQueryParameter: GetPlacesQueryParameter,
    @Query('limit', new DefaultValuePipe(8), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<GetPlacesOutput> {
    return this.placeService.getPlaces(getPlacesQueryParameter, page, limit);
  }

  @Get('search')
  @ApiOperation({ summary: '장소 검색' })
  async searchPlaces(
    @Query('query') query: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<SearchPlaceOutput> {
    return this.placeService.searchPlaceByName({ query: query, page: page });
  }

  @Get(':placeId')
  @ApiOperation({ summary: '장소의 세부정보 보기' })
  async getPlaceById(
    @GetUser() anyUser: User,
    @Param('placeId', new ParseUUIDPipe()) placeId: string,
  ): Promise<GetPlaceByIdOutput> {
    return this.placeService.getPlaceById(anyUser, placeId);
  }

  @Post('')
  @ApiOperation({ summary: '장소 생성하기' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'coverImage',
        maxCount: 1,
      },
      {
        name: 'subImages',
        maxCount: 16,
      },
    ]),
  )
  @UseGuards(RolesGuard)
  @Roles(['Client', 'Admin', 'Owner'])
  async createPlace(
    @GetUser() authUser: User,
    @Body() createPlaceInput: CreatePlaceInput,
    @UploadedFiles() files: PlacePhotoInput,
  ): Promise<CreatePlaceOutput> {
    const { coverImage } = files;
    if (!coverImage)
      return {
        ok: false,
        error: '대표 사진을 업로드 해주세요.',
      };
    return this.placeService.createPlace(authUser, createPlaceInput, files);
  }

  @Delete(':placeId')
  @ApiOperation({ summary: '장소 삭제하기' })
  async deletePlace(
    @GetUser() authUser: User,
    @Param('placeId') placeId: string,
  ): Promise<CoreOutput> {
    return this.placeService.deletePlace(authUser, placeId);
  }

  @Patch(':placeId')
  @ApiOperation({ summary: '장소 정보 수정하기 (리뷰 제외)' })
  @UseGuards(RolesGuard)
  @Roles(['Any'])
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'images',
        maxCount: 16,
      },
    ]),
  )
  async editPlace(
    @GetUser() authUser: User,
    @Param('placeId') placeId: string,
    @Body() editPlaceInput: EditPlaceInput,
    @UploadedFiles() files: EditPlacePhotoInput,
  ): Promise<CoreOutput> {
    return this.placeService.editPlace(
      authUser,
      placeId,
      editPlaceInput,
      files,
    );
  }

  // TODO: 리뷰 사진이 아니라 SubImage, coverImage Edit API 만들기
  @Patch('/:placeId/review/:reviewId')
  @ApiOperation({ summary: '장소 정보 수정하기 (리뷰 정보 변경하기)' })
  @UseGuards(RolesGuard)
  @Roles(['Admin', 'Owner'])
  @UseInterceptors(FilesInterceptor('reviewImages'))
  async editPlaceReviewImages(
    @Param('placeId', ParseUUIDPipe) placeId: string,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @UploadedFiles()
    reviewImages: Express.Multer.File[],
    @Body() editPlaceReviewImagesInput: EditPlaceReviewImagesInput,
  ): Promise<CoreOutput> {
    return { ok: true };
    // return this.placeService.editPlaceReviewImages(
    //   placeId,
    //   reviewId,
    //   reviewImages,
    //   editPlaceReviewImagesInput,
    // );
  }

  @Get('/:placeId/participants')
  @ApiOperation({ summary: '해당 장소에 예약한 참가자 리스트 보기' })
  async getPlaceParticipantList(
    @GetUser() authUser: User,
    @Param('placeId') placeId: string,
  ): Promise<GetPlaceParticipantListOutput> {
    return this.placeService.getPlaceParticipantList(placeId, authUser);
  }

  @Get('sendOkLink/:placeId/:receiverId')
  async sendOkLink(
    @GetUser() authUser: User,
    @Param('placeId', ParseUUIDPipe) placeId: string,
    @Param('receiverId', ParseUUIDPipe) receiverId: string,
  ): Promise<CoreOutput> {
    return this.placeService.sendOkLink(authUser, placeId, receiverId);
  }
}
