import { SendMessageInput } from './dtos/send-message.dto';
import { GetRoomsMessagesOutput } from './dtos/get-rooms-messages.dto';
import { Room } from './../room/entities/room.entity';
import { Message } from './entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import { CoreOutput } from './../common/common.interface';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatsGateway } from 'src/chats/chats.gateway';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getRoomsMessages(
    authUser: User,
    roomId: string,
  ): Promise<GetRoomsMessagesOutput> {
    try {
      const isAuthorized = await this.roomRepository.findOne({
        where: {
          id: roomId,
          users: [{ id: authUser.id }],
        },
      });
      console.log('isAuthorized : ', isAuthorized);
      if (!isAuthorized) {
        return {
          ok: false,
          error: '권한이 없습니다.',
        };
      }

      const messages = await this.messageRepository.find({
        where: {
          room_id: roomId,
        },
        order: {
          createdDate: 'DESC',
        },
      });
      return {
        ok: true,
        messages,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async sendMessage(
    authUser: User,
    roomId: string,
    sendMessageInput: SendMessageInput,
  ): Promise<CoreOutput> {
    try {
      if (roomId === '0') {
        const receiver = await this.userRepository.findOne({
          where: {
            id: sendMessageInput.receiver_id,
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
          receiver_id: sendMessageInput.receiver_id,
          sender_id: authUser.id,
          room_id: newRoom.id,
        });
        await this.messageRepository.save(message);
        // socket emit
      } else {
        //   기존 방에 메세지 추가
        const message = this.messageRepository.create({
          content: sendMessageInput.content,
          sender_id: authUser.id,
          receiver_id: sendMessageInput.receiver_id,
          room_id: roomId,
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
