import {
  GetRoomsMessagesOutput,
  IMessage,
} from './../dtos/get-rooms-messages.dto';
import { User } from 'src/user/entities/user.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Message } from '../entities/message.entity';

@EntityRepository(Message)
export class MessageRepository extends Repository<Message> {
  public async getRoomsMessages(
    authUser: User,
    roomId: string,
    receiverId: string,
  ): Promise<GetRoomsMessagesOutput> {
    try {
      const messages = await this.createQueryBuilder('messages')
        .where(
          'messages.receiverId = :receiverId AND messages.senderId = :senderId',
          {
            senderId: authUser.id,
            receiverId,
          },
        )
        .orWhere(
          'messages.receiverId = :senderId AND messages.senderId = :receiverId',
          {
            senderId: authUser.id,
            receiverId,
          },
        )
        .take(30)
        .skip(0)
        .orderBy('messages.sentDate', 'DESC')
        .getMany();

      // IMessage에 맞춰서 보내기
      const roomMessages: IMessage[] = [];
      for (let msg of messages) {
        roomMessages.push({
          content: msg.content,
          isMe: msg.senderId === authUser.id,
          sentAt: msg.sentDate,
          isRead: msg.isRead,
        });
      }
      return {
        ok: true,
        messages: roomMessages,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
