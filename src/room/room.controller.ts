import { RoomService } from './room.service';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { GetRoomsOutput } from './dtos/get-rooms.dto';
import { GetRoomMessagesOutput } from './dtos/get-room-messages.dto';

@ApiTags('Room')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
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

  @Get(':id')
  @ApiOperation({ summary: '채팅방 특정 방 채팅 모두 가져오기' })
  getRoomMessages(
    @Param('id', ParseUUIDPipe) roomId: string,
    @GetUser() authUser: User,
  ): Promise<GetRoomMessagesOutput> {
    return this.roomService.getRoomMessages(authUser, roomId);
  }

  @Post('')
  @ApiOperation({ summary: '채팅방 생성' })
  createRoom(@GetUser() authUser: User) {
    return this.roomService.createRoom(authUser);
  }
}
