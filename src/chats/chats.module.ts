import { Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { RoomModule } from '@room/room.module';
import { ChatsGateway } from './chats.gateway';

@Module({
  imports: [AuthModule, RoomModule],
  providers: [ChatsGateway],
  exports: [ChatsGateway],
})
export class ChatsModule {}
