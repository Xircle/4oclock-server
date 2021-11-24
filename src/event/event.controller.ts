import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateEventBannerInput } from './dtos/create-event-banner.dto';
import { EventService } from './event.service';
import { JwtAuthGuard } from '@auth/guard/jwt-auth.guard';
import { RolesGuard } from '@auth/guard/roles.guard';
import { Roles } from '@auth/roles.decorator';
import { GetUser } from '@auth/decorators/get-user.decorator';
import { User } from '@user/entities/user.entity';
import { CoreOutput } from '@common/common.interface';

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
    if (!file) return { ok: false, error: 'Only image file allowed' };
    return this.eventService.createEventBanner(
      authUser,
      file,
      createEventBannerInput,
    );
  }
}
