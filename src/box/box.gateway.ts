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
    // optionally auth here
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('room:heartbeat')
  handleRoomHeartbeat(@MessageBody() payload: any, client: Socket) {
    // validate payload minimally
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!payload || !payload.boxId) {
      this.logger.warn('Invalid heartbeat payload', payload);
      return;
    }

    // update lastSeen
    const saved = this.boxService.upsertStatus(payload);

    // broadcast update to interested clients (e.g., admins)
    this.server.emit('room:status:update', saved);

    // optional: ack to sender
    client.emit('room:heartbeat:ack', {
      ok: true,
      ts: new Date().toISOString(),
    });
  }
}
