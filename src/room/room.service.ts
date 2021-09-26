import { User } from 'src/user/entities/user.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { GetRoomsOutput } from './dtos/get-rooms.dto';
import { GetRoomMessagesOutput } from './dtos/get-room-messages.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async getRooms(authUser: User): Promise<GetRoomsOutput> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: authUser.id,
        },
        relations: ['rooms'],
      });

      console.log('rooms : ', user.rooms);
      return {
        ok: true,
        rooms: user.rooms,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async getRoomMessages(
    authUser: User,
    roomId: string,
  ): Promise<GetRoomMessagesOutput> {
    try {
      const room = await this.roomRepository.findOne({
        where: {
          id: roomId,
        },
        loadRelationIds: {
          relations: ['users'],
        },
        relations: ['messages'],
      });
      if (!room) {
        return {
          ok: false,
          error: '존재하지 않는 채팅방입니다.',
        };
      }

      console.log(room);
      return {
        ok: true,
        messages: room.messages,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async createRoom(authUser: User) {}
}
