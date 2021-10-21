import { ChatsGateway } from 'src/chats/chats.gateway';
import { MessageRepository } from './repository/message.repository';
import { AuthModule } from './../auth/auth.module';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { RoomService } from 'src/room/room.service';
import { RoomRepository } from 'src/room/repository/room.repository';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageRepository, User, RoomRepository]),
    AuthModule,
    ChatsModule,
  ],
  providers: [MessageService, RoomService],
  controllers: [MessageController],
})
export class MessageModule {}
