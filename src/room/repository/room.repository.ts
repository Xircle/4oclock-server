import { User } from 'src/user/entities/user.entity';
import { Room } from './../entities/room.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
  public async getRooms(authUser: User) {
    const qb = this.createQueryBuilder('room')
      .leftJoinAndSelect('room.users', 'users', 'users.id NOT IN (:...ids)', {
        ids: [authUser.id],
      })
      .leftJoinAndSelect('users.profile', 'profile');
    return qb.getMany();
  }
}
