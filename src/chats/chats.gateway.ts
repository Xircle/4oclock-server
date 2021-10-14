import { IsEnteringData } from './dtos/is-entering.dto';
import { RoomGuard } from './guards/room.guard';
import { ChatsGuard } from './guards/chats.guard';
import { Logger, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SendMessageData } from './dtos/send-message.dto';

@WebSocketGateway(80, {
  namespace: '/chat',
  transports: ['websocket'],
})
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;
  private logger: Logger = new Logger(ChatsGateway.name);

  afterInit() {
    this.logger.debug('Socket Server Init Complete');
  }

  handleConnection(client: Socket) {
    this.logger.debug(`${client.id} is connected!`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`${client.id} is disconnected...`);
  }

  @UseGuards(ChatsGuard, RoomGuard)
  @SubscribeMessage('join_room')
  joinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() joinRoomData: { roomId: string },
  ) {
    const { roomId } = joinRoomData;
    socket.join(roomId);
  }

  @UseGuards(ChatsGuard, RoomGuard)
  @SubscribeMessage('send_message')
  sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() sendMessageData: SendMessageData,
  ) {
    const { roomId, content } = sendMessageData;
    socket.broadcast.to(roomId).emit('receive_message', {
      content,
      sendAt: new Date(),
    });
  }

  @UseGuards(ChatsGuard, RoomGuard)
  @SubscribeMessage('is_entering')
  isEntering(
    @ConnectedSocket() socket: Socket,
    @MessageBody() isEnteringData: IsEnteringData,
  ) {
    const { roomId, flag } = isEnteringData;
    socket.broadcast.in(roomId).emit('is_entering', {
      flag,
    });
  }
}
