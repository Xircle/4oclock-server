import { CreateApplicationInput } from './dtos/create-application.dto';
import { CoreOutput } from '../common/common.interface';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from '@auth/decorators/get-user.decorator';

@ApiBearerAuth('jwt')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@UseGuards(JwtAuthGuard)
@Controller('application')
export class ApplicationController {
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '팀에 지원하기' })
  async createApplication(
    @GetUser() authUser: User,
    @Body() createApplicationInput: CreateApplicationInput,
  ): Promise<CoreOutput> {
    console.log(createApplicationInput.teamId);
    return { ok: true };
  }
}
