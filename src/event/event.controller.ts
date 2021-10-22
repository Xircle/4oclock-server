import { CreateEventBannerInput } from './dtos/create-event-banner.dto';
import { User } from 'src/user/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoreOutput } from 'src/common/common.interface';
import { RolesGuard } from './../auth/guard/roles.guard';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { EventService } from './event.service';
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

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
