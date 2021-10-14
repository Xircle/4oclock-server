import { RoomRepository } from './repository/room.repository';
import { User } from 'src/user/entities/user.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetRoomsOutput, IRoom } from './dtos/get-rooms.dto';
import { MessageRepository } from 'src/message/repository/message.repository';

@Injectable()
export class RoomService {
  constructor(
    private messageRepository: MessageRepository,
    private roomRepository: RoomRepository,
  ) {}

  async getRoomByIdWithLoadedUser(roomId: string) {
    return this.roomRepository.findOne({
      where: {
        id: roomId,
      },
      relations: ['users'],
    });
  }

  async getRooms(authUser: User): Promise<GetRoomsOutput> {
    try {
      const myRooms = await this.roomRepository.getRooms(authUser);

      const RoomByRecentSentMessage: IRoom[] = [];
      for (let myRoom of myRooms) {
        const lastMessage = await this.messageRepository.findOne({
          where: {
            roomId: myRoom.id,
          },
          order: {
            sentDate: 'DESC',
          },
        });
        console.log('lastMessage : ', lastMessage);
        if (!lastMessage) continue;
        const receiverEntity = myRoom.users.find(
          (user) => user.id !== authUser.id,
        );
        RoomByRecentSentMessage.push({
          id: myRoom.id,
          lastMessage: {
            isMe: lastMessage.senderId === authUser.id,
            content: lastMessage.content,
            isRead: lastMessage.isRead,
          },
          receiver: {
            id: receiverEntity['id'],
            profileImageUrl: receiverEntity?.profile?.profileImageUrl,
            username: receiverEntity.profile.username,
          },
          latestMessageAt: lastMessage.sentDate,
        });
      }
      return {
        ok: true,
        myRooms: RoomByRecentSentMessage,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
