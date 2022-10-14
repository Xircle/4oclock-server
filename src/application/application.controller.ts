import {
  GetApplicationByLeaderOutput,
  GetApplicationByLeaderInput,
} from './dtos/get-application-by-leader.dto';
import { EditApplicationInput } from './dtos/edit-application.dto';
import { ApplicationService } from './application.service';
import { CreateApplicationInput } from './dtos/create-application.dto';
import { CoreOutput } from '../common/common.interface';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
  constructor(private applicationService: ApplicationService) {}
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '팀에 지원하기' })
  async createApplication(
    @GetUser() authUser: User,
    @Body() createApplicationInput: CreateApplicationInput,
  ): Promise<CoreOutput> {
    return this.applicationService.createApplication(
      authUser,
      createApplicationInput,
    );
  }

  @Get('/leader')
  @ApiOperation({ summary: '특정 유저 조회 ' })
  @UseGuards(JwtAuthGuard)
  async getApplicationByLeader(
    @GetUser() authUser: User,
    @Query('applicationId')
    applicationId?: string,
    @Query('teamId')
    teamId?: number,
    @Query('userId') userId?: string,
  ): Promise<GetApplicationByLeaderOutput> {
    const getApplicationByLeaderInput: GetApplicationByLeaderInput = {
      applicationId: applicationId,
      substitue: {
        userId,
        teamId,
      },
    };
    return this.applicationService.getApplicationByLeader(
      authUser,
      getApplicationByLeaderInput,
    );
  }

  @Patch('edit')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '지원서 변경하기' })
  async editApplication(
    @Body() editApplicationInput: EditApplicationInput,
  ): Promise<CoreOutput> {
    return this.applicationService.editApplication(editApplicationInput);
  }
}
