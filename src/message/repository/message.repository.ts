import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '@user/entities/user.entity';
import {
  GetRoomsMessagesOutput,
  IMessage,
} from './../dtos/get-rooms-messages.dto';
import { Message } from '../entities/message.entity';

@EntityRepository(Message)
export class MessageRepository extends Repository<Message> {
  public async getRoomsMessages(
    authUser: User,
    roomId: string,
    receiverId: string,
    page: number,
    limit: number,
  ): Promise<GetRoomsMessagesOutput> {
    try {
      // update unread message
      await this.createQueryBuilder('messages')
        .update(Message)
        .set({ isRead: true })
        .where(
          'roomId = :roomId AND senderId = :senderId AND receiverId = :receiverId AND isRead = false',
          {
            roomId,
            senderId: receiverId,
            receiverId: authUser.id,
          },
        )
        .execute();

      const query = this.createQueryBuilder('messages')
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
        );

      const totalItems = await query.getCount();
      const totalPages = Math.floor(totalItems / limit) + 1;
      const paginatedMessages = await query
        .take(limit)
        .skip(limit * (page - 1))
        .orderBy('messages.sentAt', 'DESC')
        .getMany();

      // IMessage에 맞춰서 보내기
      const roomMessages: IMessage[] = [];
      for (let msg of paginatedMessages) {
        roomMessages.push({
          content: msg.content,
          isMe: msg.senderId === authUser.id,
          sentAt: msg.sentAt,
          isRead: msg.isRead,
        });
      }
      return {
        ok: true,
        messages: roomMessages,
        meta: {
          totalItems,
          totalPages,
          currentPage: page,
          hasMore: totalPages > page,
        },
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
