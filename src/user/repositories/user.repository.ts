import { EntityRepository, Repository } from 'typeorm';
import { User } from './../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async findRandomUser(
    userId: string,
    myTeamOnly: boolean,
    team?: string,
  ) {
    const queryBuilder = this.createQueryBuilder('User')
      .where(`User.id != :id`, { id: userId })
      .leftJoinAndSelect('User.profile', 'User_profile')
      .orderBy('RANDOM()');
    return myTeamOnly && team
      ? queryBuilder
          .andWhere(`User_profile.team = :team`, {
            team: team,
          })
          .getOne()
      : queryBuilder.getOne();
  }

  public async getRoomsOrderByRecentMessage(authUser: User): Promise<User> {
    const qb = this.createQueryBuilder('User')
      .leftJoinAndSelect('User.rooms', 'ParticipatingRooms')
      .leftJoinAndSelect('ParticipatingRooms.users', 'Participants')
      .leftJoinAndSelect('ParticipatingRooms.messages', 'RoomMessages')
      .leftJoinAndSelect(`Participants.profile`, 'Participants.profile')
      .where('User.id = :userId', { userId: authUser.id })
      .orderBy({
        'RoomMessages.sentAt': 'DESC',
      });

    return qb.getOne();
  }
}
