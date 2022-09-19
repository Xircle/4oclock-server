import { CreateApplicationInput } from './dtos/create-application.dto';
import { CoreOutput } from './../common/common.interface';
import { User } from './../user/entities/user.entity';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from '@auth/decorators/get-user.decorator';

@ApiOkResponse()
@ApiUnauthorizedResponse()
@Controller('applications')
export class ApplicationsController {
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '팀에 지원하기' })
  async createApplications(
    @GetUser() authUser: User,
    @Body() createEventBannerInput: CreateApplicationInput,
  ): Promise<CoreOutput> {
    return { ok: true };
  }
}
