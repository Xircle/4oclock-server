import { EditProfileInput } from './dtos/edit-profile.dto';
import { SeeUserByIdOutput } from './dtos/see-user-by-id.dto';
import { GetMyPlaceOutput } from './dtos/get-place-history.dto';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { SeeRandomProfileOutput } from './dtos/see-random-profile.dto';
import { CoreOutput } from 'src/common/common.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParsePipe } from 'src/common/pipe/parse.pipe';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth('jwt')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@UseGuards(AuthGuard('jwt'))
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
    @Body(new ParsePipe())
    editProfileInput: EditProfileInput,
  ): Promise<CoreOutput> {
    return this.userService.editProfile(authUser, file, editProfileInput);
  }

  @Get('/profile/random')
  @ApiOperation({ summary: '랜덤 유저 프로필 조회' })
  async seeRandomProfile(
    @GetUser() authUser: User,
  ): Promise<SeeRandomProfileOutput> {
    return this.userService.seeRandomProfile(authUser);
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
