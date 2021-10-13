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
import { SendMessageInput } from './dtos/send-message.dto';

@WebSocketGateway(80, {
  namespace: /^\/chat-\w+$/,
  transports: ['websocket'],
})
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;
  private logger: Logger = new Logger(ChatsGateway.name);

  afterInit() {
    this.logger.log('Socket Server Init Complete');
  }

  handleConnection(client: Socket) {
    console.log(client.handshake.query?.token);
    this.logger.debug(`${client.id} is connected!`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`${client.id} is disconnected...`);
  }

  @UseGuards(ChatsGuard, RoomGuard)
  @SubscribeMessage('send_message')
  sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() sendMessageInput: SendMessageInput,
  ) {
    const namespace = socket.nsp;
    // console.log('sendMessage => chat namespace : ', namespace);
    // console.log('sendMessage => sendMessageInput : ', sendMessageInput);
    const { roomId, content } = sendMessageInput;
    // socket.broadcast.to(roomId).emit('receive_message', {
    //   content,
    // });
  }
}
