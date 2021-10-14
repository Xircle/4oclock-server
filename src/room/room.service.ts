import { RoomRepository } from './repository/room.repository';
import { User } from 'src/user/entities/user.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetRoomsOutput, IRoom } from './dtos/get-rooms.dto';

@Injectable()
export class RoomService {
  constructor(private roomRepository: RoomRepository) {}

  async getRoomById(roomId: string) {
    return this.roomRepository.findOne({
      where: {
        id: roomId,
      },
      loadRelationIds: {
        relations: ['users'],
      },
    });
  }

  async getRooms(authUser: User): Promise<GetRoomsOutput> {
    try {
      const myRooms = await this.roomRepository.getRoomsOrderByRecentMessage(authUser);
      return {
        ok: true,
        myRooms,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
