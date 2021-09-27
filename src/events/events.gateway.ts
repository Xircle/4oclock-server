import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(80, {
  namespace: /\/ws-.+/,
  transports: ['websocket'],
  cors: true,
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    console.log(data);
    return data;
  }

  afterInit(server: Server) {
    this.logger.log('init');
  }
  handleConnection(client: Socket) {
    this.logger.log(`Client connected : ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected : ${client.id}`);
  }
}
