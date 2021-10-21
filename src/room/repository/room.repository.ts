import { User } from 'src/user/entities/user.entity';
import { Room } from './../entities/room.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
  public async getRooms(authUser: User) {
    const qb = this.createQueryBuilder('room')
      .innerJoin('room.users', 'users')
      .where('users.id IN (:...ids)', {
        ids: [authUser.id],
      });
    return qb.getMany();
  }
}
