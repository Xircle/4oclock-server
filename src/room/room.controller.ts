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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { GetRoomsOutput } from './dtos/get-rooms.dto';
import { GetRoomMessagesOutput } from './dtos/get-room-messages.dto';

@ApiTags('ROOM')
@UseGuards(AuthGuard('jwt'))
@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @ApiOperation({ summary: '채팅방 모두 가져오기' })
  @Get('')
  getRooms(@GetUser() authUser: User): Promise<GetRoomsOutput> {
    return this.roomService.getRooms(authUser);
  }

  @ApiOperation({ summary: '채팅방 특정 방 채팅 모두 가져오기' })
  @Get(':id')
  getRoomMessages(
    @Param('id', ParseUUIDPipe) roomId: string,
    @GetUser() authUser: User,
  ): Promise<GetRoomMessagesOutput> {
    return this.roomService.getRoomMessages(authUser, roomId);
  }

  @ApiOperation({ summary: '채팅방 생성' })
  @Post()
  createRoom(@GetUser() authUser: User) {
    return this.roomService.createRoom(authUser);
  }
}
