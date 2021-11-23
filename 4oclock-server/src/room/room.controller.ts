import { RoomService } from './room.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetRoomsOutput } from './dtos/get-rooms.dto';
import { GetUser } from '@auth/decorators/get-user.decorator';
import { User } from '@user/entities/user.entity';
import { JwtAuthGuard } from '@auth/guard/jwt-auth.guard';

@ApiTags('Room')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@ApiOkResponse()
@ApiUnauthorizedResponse()
@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get('')
  @ApiOperation({ summary: '채팅방 모두 가져오기' })
  getRooms(@GetUser() authUser: User): Promise<GetRoomsOutput> {
    return this.roomService.getRooms(authUser);
  }
}
