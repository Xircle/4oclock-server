import { GetMyApplicationsOutput } from './dtos/get-my-applications.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { EditProfileInput, EditPlaceQueryParam } from './dtos/edit-profile.dto';
import { SeeUserByIdOutput } from './dtos/see-user-by-id.dto';
import {
  GetMyPlaceOutput,
  GetMyPlaceCreatedOutput,
} from './dtos/get-place-history.dto';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { SeeRandomProfileOutput } from './dtos/see-random-profile.dto';
import { JwtAuthGuard } from '@auth/guard/jwt-auth.guard';
import { GetUser } from '@auth/decorators/get-user.decorator';
import { CoreOutput } from '@common/common.interface';
import { GetPointOutput } from './dtos/get-point.dto';
import { Roles } from '@auth/roles.decorator';
import { GetMyTeamsLeaderOutput } from './dtos/get-my-teams-leader.dto';

@ApiTags('User')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: '유저 정보 ' })
  async me(@GetUser() authUser: User) {
    return this.userService.me(authUser);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Patch('me/verify/:code')
  @ApiOperation({ summary: '유저 활동코드 입력' })
  async VerifyByCode(
    @GetUser() authUser: User,
    @Param('code') code: string,
  ): Promise<CoreOutput> {
    return this.userService.verifyUserByCode(authUser, code);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Patch('me/team/:teamId')
  async patchTeam(
    @GetUser() authUser: User,
    @Param('teamId') teamId: number,
  ): Promise<CoreOutput> {
    return this.userService.patchTeam(authUser, teamId);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Put('')
  @ApiOperation({ summary: '유저 정보 수정 ' })
  @UseInterceptors(FileInterceptor('profileImageFile'))
  async editProfile(
    @Query() editPlaceQueryParam: EditPlaceQueryParam,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() authUser: User,
    @Body() editProfileInput: EditProfileInput,
  ): Promise<CoreOutput> {
    return this.userService.editProfile(
      editPlaceQueryParam,
      authUser,
      file,
      editProfileInput,
    );
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete('/delete')
  @ApiOperation({ summary: '유저 삭제' })
  async deleteUser(@GetUser() authUser: User): Promise<CoreOutput> {
    return this.userService.deleteUser(authUser);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('/profile/random')
  @ApiOperation({ summary: '랜덤 유저 프로필 조회' })
  @ApiQuery({
    name: 'myTeamOnly',
    required: true,
    description: '내 팀원만 보기 ',
  })
  async seeRandomProfile(
    @GetUser() authUser: User,
    @Query('myTeamOnly') myTeamOnly: boolean,
  ): Promise<SeeRandomProfileOutput> {
    return this.userService.seeRandomProfile(authUser, myTeamOnly);
  }

  @Get('/profile/:id')
  @ApiOperation({ summary: '특정 유저 조회 ' })
  async seeUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SeeUserByIdOutput> {
    return this.userService.seeUserById(id);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('history')
  @ApiOperation({ summary: '유저가 신청한 모임 조회' })
  async getMyPlace(@GetUser() authUser: User): Promise<GetMyPlaceOutput> {
    return this.userService.getMyPlace(authUser);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('history/created')
  @ApiOperation({ summary: '유저가 생성한 모임 조회' })
  async getMyPlaceCreated(
    @GetUser() authUser: User,
  ): Promise<GetMyPlaceCreatedOutput> {
    return this.userService.getMyPlaceCreated(authUser);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('history/applications')
  @ApiOperation({ summary: '유저가 지원한 팀 조회' })
  async getMyApplications(
    @GetUser() authUser: User,
  ): Promise<GetMyApplicationsOutput> {
    return this.userService.getMyApplications(authUser);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('leader/myteams')
  @Roles(['Owner'])
  @ApiOperation({ summary: '유저가 담당하는 팀들 조회' })
  async getMyTeamsLeader(
    @GetUser() authUser: User,
  ): Promise<GetMyTeamsLeaderOutput> {
    return this.userService.getMyTeamsLeader(authUser);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('point')
  async getPoint(@GetUser() authUser: User): Promise<GetPointOutput> {
    return this.userService.getPoint(authUser, 1);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('report/:userId')
  @ApiOperation({ summary: '특정 유저 신고하기' })
  async reportUser(@GetUser() authUser: User) {
    return this.userService.reportUser();
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('/fbtoken/:token')
  @ApiOperation({ summary: 'for testing' })
  async updateFirebaseToken(
    @GetUser() authUser: User,
    @Param('token') token: string,
  ) {
    return this.userService.updateFirebaseToken(authUser, token);
  }
}
