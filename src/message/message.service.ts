import { RoomService } from './../room/room.service';
import { MessageRepository } from './repository/message.repository';
import { SendMessageInput, SendMessageOutput } from './dtos/send-message.dto';
import { GetRoomsMessagesOutput } from './dtos/get-rooms-messages.dto';
import { User } from 'src/user/entities/user.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomRepository } from 'src/room/repository/room.repository';
import { ChatsGateway } from 'src/chats/chats.gateway';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roomRepository: RoomRepository,
    private readonly messageRepository: MessageRepository,
    private readonly roomService: RoomService,
    private readonly chatsGateway: ChatsGateway,
  ) {}

  async getRoomsMessages(
    authUser: User,
    roomId: string,
    receiverId: string,
  ): Promise<GetRoomsMessagesOutput> {
    if (roomId === '0') return { ok: true, messages: [] };
    const existRoom = await this.roomService.getRoomByIdWithLoadedUser(roomId);
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
    );
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
        });
        await this.messageRepository.save(message);

        // 소켓에 Join
        this.chatsGateway.server.socketsJoin(newRoom.id);
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
