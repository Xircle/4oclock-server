import { User } from 'src/user/entities/user.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { GetRoomsOutput } from './dtos/get-rooms.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

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
      const myRooms = await this.roomRepository.find({
        where: {
          users: [{ id: authUser.id }],
        },
      });
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
