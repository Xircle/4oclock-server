import { RoomRepository } from './repository/room.repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetRoomsOutput, IRoom } from './dtos/get-rooms.dto';
import { UserRepository } from '@user/repositories/user.repository';
import { MessageRepository } from '@message/repository/message.repository';
import { User } from '@user/entities/user.entity';

@Injectable()
export class RoomService {
  constructor(
    private userRepository: UserRepository,
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
      const { rooms } = await this.userRepository.getRoomsOrderByRecentMessage(
        authUser,
      );

      const RoomOrderByRecentSentMessage: IRoom[] = [];
      let hasAtLeastOneUnreadMessage = false;
      for (let myRoom of rooms) {
        const lastMessage = await this.messageRepository.findOne({
          where: {
            roomId: myRoom.id,
          },
          order: {
            sentAt: 'DESC',
          },
        });
        if (!lastMessage) continue;

        const hasUnreadMessage =
          lastMessage.senderId === authUser.id ? false : !lastMessage.isRead;
        if (!hasAtLeastOneUnreadMessage && hasUnreadMessage) {
          hasAtLeastOneUnreadMessage = true;
        }

        const receiverEntity = myRoom.users.find(
          (user) => user.id !== authUser.id,
        );

        if (!receiverEntity) continue;

        RoomOrderByRecentSentMessage.push({
          id: myRoom.id,
          lastMessage: {
            isMe: lastMessage.senderId === authUser.id,
            content: lastMessage.content,
            isRead:
              lastMessage.senderId === authUser.id ? true : lastMessage.isRead,
          },
          receiver: {
            id: receiverEntity['id'],
            profileImageUrl: receiverEntity?.profile?.profileImageUrl,
            username: receiverEntity.profile?.username,
          },
          latestMessageAt: lastMessage.sentAt,
        });
      }
      return {
        ok: true,
        myRooms: RoomOrderByRecentSentMessage,
        hasUnreadMessage: hasAtLeastOneUnreadMessage,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
