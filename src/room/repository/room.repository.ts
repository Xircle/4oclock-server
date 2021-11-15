import { EntityRepository, Repository } from 'typeorm';
import { User } from '@user/entities/user.entity';
import { Room } from '@room/entities/room.entity';

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
