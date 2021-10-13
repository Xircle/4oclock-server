import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';

@Module({
  imports: [AuthModule],
  providers: [ChatsGateway, ChatsService],
  exports: [ChatsGateway],
})
export class ChatsModule {}
