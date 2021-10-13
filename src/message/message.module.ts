import { AuthModule } from './../auth/auth.module';
import { User } from 'src/user/entities/user.entity';
import { Room } from './../room/entities/room.entity';
import { Message } from './entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Room, User]), AuthModule],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
