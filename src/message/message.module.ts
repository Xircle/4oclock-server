import { ChatsGateway } from 'src/chats/chats.gateway';
import { MessageRepository } from './repository/message.repository';
import { ChatsModule } from './../chats/chats.module';
import { AuthModule } from './../auth/auth.module';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Room } from 'src/room/entities/room.entity';
import { RoomService } from 'src/room/room.service';
import { RoomRepository } from 'src/room/repository/room.repository';
import { Message } from './entities/message.entity';

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
