import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ namespace: '/notification', cors: true })
export default class NotificationGateway {
  @WebSocketServer() wss!: Server;

  @SubscribeMessage('subscribe')
  handleEvent(client: Socket, userId: string) {
    client.join(userId);
    console.log('User ' + userId + ' has subscribed notification');
    return { message: 'From server: Successfully subscribe notification' };
  }

  sendNotiToUser(userId: string, data: any) {
    this.wss.to(userId).emit('receive-notification', data);
  }
}
