import { NotificationService } from './../notification/notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MessageRepository } from './repository/message.repository';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { UserRepository } from '@user/repositories/user.repository';
import { RoomRepository } from '@room/repository/room.repository';
import { AuthModule } from '@auth/auth.module';
import { ChatsModule } from '@chats/chats.module';
import { RoomService } from '@room/room.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageRepository,
      UserRepository,
      RoomRepository,
    ]),
    AuthModule,
    ChatsModule,
  ],
  providers: [MessageService, RoomService, NotificationService],
  controllers: [MessageController],
})
export class MessageModule {}
