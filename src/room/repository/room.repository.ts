import { User } from 'src/user/entities/user.entity';
import { Room } from './../entities/room.entity';
import { EntityRepository, Repository } from 'typeorm';
import { IRoom } from '../dtos/get-rooms.dto';

// matchRepository
//       .createQueryBuilder('match')
//       .innerJoin(
//         query => {
//           return query
//             .from(MatchParticipant, 'p')
//             .select('p."matchId"')
//             .where('p."userId" = :id');
//         },
//         'selfMatch',
//         '"selfMatch"."matchId" = match.id',
//       )
//       .leftJoinAndSelect('match.participants', 'participants')
//       .leftJoinAndSelect('participants.user', 'user')
//       .setParameter('id', id)
//       .getMany();
@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
  public async getRoomsOrderByRecentMessage(authUser: User): Promise<IRoom[]> {
    // let myRooms = this.createQueryBuilder('room').innerJoin(() => {},
    // 'selfRoom');
    // let myRooms = await this.roomRepository.find({
    //   relations: ['users', 'message'],
    // });
    // Decide lastMessage

    // Decide lastMessageAt

    // Remove authUser data
    const roomData: IRoom[] = [];
    // for (let room of [myRooms]) {
    //   for (let user of room.users) {
    //     if (user.id === authUser.id) return;
    //     // Without authUser data
    //     roomData.push({
    //       id: room.id,
    //       receiver: {
    //         id: user.id,
    //         profileImageUrl: user.profile.profileImageUrl,
    //         username: user.profile.username,
    //       },
    //       lastMessage: {
    //         isMe: true,
    //         isRead: true,
    //         content: '',
    //       },
    //       latestMessageAt: new Date(),
    //     });
    //   }
    // }

    return [];
  }
  // public async findRandomUser() {
  //   const queryBuilder = this.createQueryBuilder('Room')
  //     .where(`User.id != :id`, { id: userId })
  //     .leftJoinAndSelect('User.profile', 'User_profile')
  //     .orderBy('RANDOM()');

  // }
}
