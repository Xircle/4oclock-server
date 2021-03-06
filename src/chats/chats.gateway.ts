import { Server, Socket } from 'socket.io';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
import { SendMessageData } from './dtos/send-message.dto';
import { JoinRoomData } from './dtos/join-room.dto';
import { RoomGuard } from './guards/room.guard';
import { ChatsGuard } from './guards/chats.guard';
import { IsEnteringData } from './dtos/is-entering.dto';
import '../env';

@ApiTags('ChatGateway')
@WebSocketGateway({
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
    this.logger.debug(`${client.id} is disconnected...`);
  }

  @UseGuards(ChatsGuard, RoomGuard)
  @SubscribeMessage('join_room')
  @ApiOperation({ summary: '방에 들어갈 때의 event' })
  joinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() joinRoomData: JoinRoomData,
  ) {
    socket.join(joinRoomData.roomId);
    socket.broadcast.to(joinRoomData.roomId).emit('join_room');
  }

  @SubscribeMessage('leave_room')
  public leaveRoom(client: Socket, data: { roomId: string }) {
    console.log('Leave : ', data.roomId);
    client.leave(data.roomId);
    client.broadcast.to(data.roomId).emit('leave_room');
  }

  @UseGuards(ChatsGuard, RoomGuard)
  @SubscribeMessage('send_message')
  @ApiOperation({ summary: '메세지를 보낼 때의 event' })
  sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() sendMessageData: SendMessageData,
  ) {
    const { roomId, content } = sendMessageData;
    socket.broadcast.to(roomId).emit('receive_message', {
      content,
      sentAt: new Date(),
    });
  }

  @UseGuards(ChatsGuard, RoomGuard)
  @SubscribeMessage('is_entering')
  @ApiOperation({ summary: '글을 작성할 때의 event' })
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
