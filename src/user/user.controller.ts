import { SeeUserByIdOutput } from './dtos/see-user-by-id.dto';
import { GetMyPlaceOutput } from './dtos/getPlaceHistory.dto';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { SeeRandomProfileOutput } from './dtos/see-random-profile.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@GetUser() authUser: User) {
    return this.userService.me(authUser);
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
