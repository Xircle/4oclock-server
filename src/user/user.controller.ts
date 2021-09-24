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

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@GetUser() authUser: User) {
    return this.userService.me(authUser);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  async seeRandomProfile(
    @GetUser() authUser: User,
  ): Promise<SeeRandomProfileOutput> {
    return this.userService.seeRandomProfile(authUser);
  }

  @Get('/profile/:id')
  async seeUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SeeUserByIdOutput> {
    return this.userService.seeUserById(id);
  }

  @Get('history')
  @UseGuards(AuthGuard('jwt'))
  async getMyPlace(@GetUser() authUser: User): Promise<GetMyPlaceOutput> {
    return this.userService.getMyPlace(authUser);
  }
}
