import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserRepository } from '@user/repositories/user.repository';
import { RoomRepository } from '@room/repository/room.repository';
import { RoomService } from '@room/room.service';
import { User } from '@user/entities/user.entity';
import { MessageRepository } from './repository/message.repository';
import { SendMessageInput, SendMessageOutput } from './dtos/send-message.dto';
import { GetRoomsMessagesOutput } from './dtos/get-rooms-messages.dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roomRepository: RoomRepository,
    private readonly messageRepository: MessageRepository,
    private readonly roomService: RoomService,
  ) {}

  async getRoomsMessages(
    authUser: User,
    roomId: string,
    receiverId: string,
    page: number,
    limit: number,
  ): Promise<GetRoomsMessagesOutput> {
    try {
      if (roomId === '0') return { ok: true, messages: [] };
      const existRoom = await this.roomService.getRoomByIdWithLoadedUser(
        roomId,
      );
      if (
        !existRoom ||
        !existRoom.users.some((user) => user.id === authUser.id)
      ) {
        return {
          ok: false,
          error: '권한이 없습니다.',
        };
      }

      return this.messageRepository.getRoomsMessages(
        authUser,
        roomId,
        receiverId,
        page,
        limit,
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async sendMessage(
    authUser: User,
    roomId: string,
    sendMessageInput: SendMessageInput,
  ): Promise<SendMessageOutput> {
    try {
      if (roomId === '0') {
        const receiver = await this.userRepository.findOne({
          where: {
            id: sendMessageInput.receiverId,
          },
        });
        if (!receiver) {
          return {
            ok: false,
            error: '존재하지 않는 유저입니다.',
          };
        }
        //   방 생성 후, 그 방에 메세지 추가
        const newRoom = this.roomRepository.create({
          users: [receiver, authUser],
        });
        await this.roomRepository.save(newRoom);

        const message = this.messageRepository.create({
          content: sendMessageInput.content,
          receiverId: sendMessageInput.receiverId,
          senderId: authUser.id,
          roomId: newRoom.id,
          isRead: sendMessageInput.isRead,
        });
        await this.messageRepository.save(message);

        return {
          ok: true,
          createdRoomId: newRoom.id,
        };
      } else {
        //   기존 방에 메세지 추가
        const message = this.messageRepository.create({
          content: sendMessageInput.content,
          roomId: roomId,
          receiverId: sendMessageInput.receiverId,
          senderId: authUser.id,
        });
        await this.messageRepository.save(message);
      }
      return {
        ok: true,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
