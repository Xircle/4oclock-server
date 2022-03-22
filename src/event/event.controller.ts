import { GetManyEventBannersOutput } from './dtos/get-many-event-banner.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateEventBannerInput,
  EventPhotoInput,
} from './dtos/create-event-banner.dto';
import { EventService } from './event.service';
import { JwtAuthGuard } from '@auth/guard/jwt-auth.guard';
import { RolesGuard } from '@auth/guard/roles.guard';
import { Roles } from '@auth/roles.decorator';
import { GetUser } from '@auth/decorators/get-user.decorator';
import { User } from '@user/entities/user.entity';
import { CoreOutput } from '@common/common.interface';

@ApiTags('Event')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {}

  @Post('banner')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: '이벤트 배너 생성하기' })
  @Roles(['Admin'])
  @UseInterceptors(FileInterceptor('eventBannerImage'))
  async createEventBanner(
    @GetUser() authUser: User,
    @Body() createEventBannerInput: CreateEventBannerInput,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CoreOutput> {
    if (!file)
      return {
        ok: false,
        error: '대표 사진을 업로드 해주세요.',
      };
    return this.eventService.createEventBanner(
      authUser,
      file,
      createEventBannerInput,
    );
  }

  @Get('banner/many')
  @ApiOperation({ summary: 'get 5 most recent event banners' })
  async getManyEventBanners(): Promise<GetManyEventBannersOutput> {
    return this.eventService.getManyEventBanners();
  }
}
