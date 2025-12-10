import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('Socket server initialized');
    setInterval(() => {
      const message = Date.now();
      this.server.emit('minute_tick', message);
      console.log('Emit message:', message);
    }, 60 * 1000);
  }
}
