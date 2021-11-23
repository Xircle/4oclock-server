import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { RoomRepository } from './repository/room.repository';
import { UserRepository } from '@user/repositories/user.repository';
import { MessageRepository } from '@message/repository/message.repository';
import { AuthModule } from '@auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

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
