import {
  Body,
  CacheInterceptor,
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

@ApiTags('User')
@ApiBearerAuth('jwt')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: '유저 정보 ' })
  async me(@GetUser() authUser: User) {
    return this.userService.me(authUser);
  }

  @Patch('me/:code')
  @ApiOperation({ summary: '유저 활동코드 입력' })
  async VerifyByCode(
    @GetUser() authUser: User,
    @Param('code') code: string,
  ): Promise<CoreOutput> {
    return this.userService.verifyUserByCode(authUser, code);
  }

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

  @Delete('/delete')
  @ApiOperation({ summary: '유저 삭제' })
  async deleteUser(@GetUser() authUser: User): Promise<CoreOutput> {
    return this.userService.deleteUser(authUser);
  }

  @Get('/profile/random')
  @ApiOperation({ summary: '랜덤 유저 프로필 조회' })
  @ApiQuery({
    name: 'ykClubOnly',
    required: true,
    description: '연고이팅 동아리 친구만 보기 ',
  })
  async seeRandomProfile(
    @GetUser() authUser: User,
    @Query('ykClubOnly') ykClubOnly: boolean,
  ): Promise<SeeRandomProfileOutput> {
    return this.userService.seeRandomProfile(authUser, ykClubOnly);
  }

  @Get('/profile/:id')
  @ApiOperation({ summary: '특정 유저 조회 ' })
  async seeUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SeeUserByIdOutput> {
    return this.userService.seeUserById(id);
  }

  @Get('history')
  @ApiOperation({ summary: '유저가 신청한 모임 조회' })
  async getMyPlace(@GetUser() authUser: User): Promise<GetMyPlaceOutput> {
    return this.userService.getMyPlace(authUser);
  }

  @Get('history/created')
  @ApiOperation({ summary: '유저가 생성한 모임 조회' })
  async getMyPlaceCreated(
    @GetUser() authUser: User,
  ): Promise<GetMyPlaceCreatedOutput> {
    return this.userService.getMyPlaceCreated(authUser);
  }

  @Get('report/:userId')
  @ApiOperation({ summary: '특정 유저 신고하기' })
  async reportUser(@GetUser() authUser: User) {
    return this.userService.reportUser();
  }

  @Post('/fbtoken/:token')
  @ApiOperation({ summary: 'for testing' })
  async updateFirebaseToken(
    @GetUser() authUser: User,
    @Param('token') token: string,
  ) {
    return this.userService.updateFirebaseToken(authUser, token);
  }
}
