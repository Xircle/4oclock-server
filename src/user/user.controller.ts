import {
  Body,
  CacheInterceptor,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
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
import { EditProfileInput } from './dtos/edit-profile.dto';
import { SeeUserByIdOutput } from './dtos/see-user-by-id.dto';
import { GetMyPlaceOutput } from './dtos/get-place-history.dto';
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

  @Put('')
  @ApiOperation({ summary: '유저 정보 수정 ' })
  @UseInterceptors(FileInterceptor('profileImageFile'))
  async editProfile(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() authUser: User,
    @Body() editProfileInput: EditProfileInput,
  ): Promise<CoreOutput> {
    return this.userService.editProfile(authUser, file, editProfileInput);
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
  @ApiOperation({ summary: '유저가 신청한 써클 조회' })
  async getMyPlace(@GetUser() authUser: User): Promise<GetMyPlaceOutput> {
    return this.userService.getMyPlace(authUser);
  }
}
