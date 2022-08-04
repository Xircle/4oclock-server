import { Place } from '@place/entities/place.entity';
import { Reservation } from '@reservation/entities/reservation.entity';
import { Team } from 'team/entities/team.entity';
import { EntityRepository, Repository, getConnection } from 'typeorm';
import { User } from './../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async findRandomUser(
    userId: string,
    myTeamOnly: boolean,
    team?: Team,
  ) {
    const queryBuilder = this.createQueryBuilder('User')
      .where(`User.id != :id`, { id: userId })
      .leftJoinAndSelect('User.profile', 'User_profile')
      .orderBy('RANDOM()');
    return myTeamOnly && team
      ? queryBuilder
          .andWhere(`User.team_id = :team`, {
            team: team.id,
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

  public async getPointThisSeason(
    authUser: User,
    season: number,
  ): Promise<number> {
    const myTeamCount = await getConnection()
      .createQueryBuilder()
      .select('reservation')
      .from(Reservation, 'reservation')
      .addFrom(Place, 'place')
      .addFrom(Team, 'team')
      .where('reservation.place_id = place.id')
      .andWhere('reservation.is_canceled = false')
      .andWhere('place.place_type = :type', { type: 'Regular-meeting' })
      .andWhere('reservation.user_id = :userId', { userId: authUser.id })
      .andWhere('place.team_id = :teamId', { teamId: authUser.team_id })
      .andWhere('team.id = place.team_id')
      .andWhere('team.season = :season', { season: season })
      .getCount();

    const otherTeamCount = await getConnection()
      .createQueryBuilder()
      .select('reservation')
      .from(Reservation, 'reservation')
      .addFrom(Place, 'place')
      .addFrom(Team, 'team')
      .where('reservation.place_id = place.id')
      .andWhere('reservation.is_canceled = false')
      .andWhere('place.place_type = :type', { type: 'Regular-meeting' })
      .andWhere('reservation.user_id = :userId', { userId: authUser.id })
      .andWhere('place.team_id != :teamId', { teamId: authUser.team_id })
      .andWhere('team.id = place.team_id')
      .andWhere('team.season = :season', { season: season })
      .getCount();

    return myTeamCount + otherTeamCount / 2;
  }
}
