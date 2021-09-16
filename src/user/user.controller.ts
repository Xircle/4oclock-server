import { GetMyPlaceOutput } from './dtos/getPlaceHistory.dto';
import { MeOutput } from './dtos/me.dto';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { SeeRandomProfileOutput } from './dtos/see-random-profile.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@AuthUser() authUser: User) {
    return this.userService.me(authUser);
  }

  @Get('friend')
  @UseGuards(AuthGuard('jwt'))
  async seeRandomProfile(
    @AuthUser() authUser: User,
  ): Promise<SeeRandomProfileOutput> {
    return this.userService.seeRandomProfile(authUser);
  }

  @Get('history')
  @UseGuards(AuthGuard('jwt'))
  async getMyPlace(@AuthUser() authUser: User): Promise<GetMyPlaceOutput> {
    return this.userService.getMyPlace(authUser);
  }
}
