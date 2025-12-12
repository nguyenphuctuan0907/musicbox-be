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

  // --- NEW: Emit trạng thái thanh toán cho FE ---
  emitPaymentStatus(boxId: number, data: any) {
    const room = `box_${boxId}`;
    this.server.to(room).emit('payment_status', data);

    console.log(`Emit payment update to ${room}:`, data);
  }
}
