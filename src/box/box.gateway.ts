// room.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { BoxService } from './box.service';
import { AppError } from 'libs/error/base.error';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/', // hoặc '/pos'
})
export class BoxGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(BoxGateway.name);

  constructor(private readonly boxService: BoxService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('room:heartbeat')
  async handleRoomHeartbeat(@MessageBody() payload: any, client: Socket) {
    // validate payload minimally
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!payload || !payload.boxId) {
      this.logger.warn('Invalid heartbeat payload', payload);
      return;
    }

    // update lastSeen
    const saved = await this.boxService.upsertStatus(payload);

    if (!saved) {
      throw new AppError('Failed to upsert room status', 400);
    }

    setInterval(() => {
      this.server.emit('room:status:update', saved);
      this.logger.log('Emit new data: ', saved);
    }, 60 * 1000);

    // broadcast update to interested clients (e.g., admins)
    client.broadcast.emit('room:status:update', saved);
  }
}
