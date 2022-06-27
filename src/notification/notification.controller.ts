import { User } from '@user/entities/user.entity';
import { GetUser } from '@auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '@auth/guard/jwt-auth.guard';
import { CoreOutput } from '@common/common.interface';
import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('notification?placeId=:placeId&receiverId=:receiverId')
@ApiBearerAuth('jwt')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@UseGuards(JwtAuthGuard)
@Controller('notification')
export class NotificationController {
  @Get('sendOkLink')
  async sendOkLink(
    @GetUser() authUser: User,
    @Param('placeId', ParseUUIDPipe) placeId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<CoreOutput> {
    return this.sendOkLink(authUser, placeId, userId);
  }
}
