import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RoomGuardDto } from '@chats/dtos/room-guard.dto';
import { RoomService } from '@room/room.service';

@Injectable()
export class RoomGuard implements CanActivate {
  constructor(private roomService: RoomService) {}

  async canActivate(context: ExecutionContext) {
    const data = context.switchToWs().getData<RoomGuardDto>();
    if (data.roomId === '0') return true;
    const existRoom = await this.roomService.getRoomByIdWithLoadedUser(
      data.roomId,
    );
    if (
      !existRoom ||
      !existRoom.users.some((user) => user.id === data.anonymouseId)
    )
      return false;

    return true;
  }
}
