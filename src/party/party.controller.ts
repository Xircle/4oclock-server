import { User } from './../user/entities/user.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from './../auth/guard/roles.guard';
import { Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from '@auth/roles.decorator';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { GetUser } from '@auth/decorators/get-user.decorator';

@Controller('party')
export class PartyController {
  @Post('')
  @ApiOperation({ summary: '장소 생성하기' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'images',
        maxCount: 16,
      },
    ]),
  )
  @UseGuards(RolesGuard)
  @Roles(['Owner'])
  async createParty(@GetUser() authUser: User) {}
}
