import { RoomService } from './../../room/room.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RoomGuardDto } from '../dtos/room-guard.dto';
import { Socket } from 'socket.io';

@Injectable()
export class RoomGuard implements CanActivate {
  constructor(private roomService: RoomService) {}

  async canActivate(context: ExecutionContext) {
    const data = context.switchToWs().getData<RoomGuardDto>();
    const client: Socket = context.switchToWs().getClient();
    console.log(data);

    const existRoom = await this.roomService.getRoomById(data.roomId);
    console.log(existRoom);
    if (
      !existRoom ||
      !existRoom.users.some((user) => user.id === data.senderId)
    )
      return false;

    return true;
  }
}
