import { UserRepository } from 'src/user/repositories/user.repository';
import { MessageRepository } from './../message/repository/message.repository';
import { RoomRepository } from './repository/room.repository';
import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      RoomRepository,
      MessageRepository,
    ]),
    AuthModule,
  ],
  providers: [RoomService],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
