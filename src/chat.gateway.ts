// import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { Server } from 'socket.io';

// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
// export class ChatGateway {
//   @WebSocketServer()
//   server: Server;

//   constructor() {
//     setInterval(() => {
//       const message = Date.now();
//       this.server.emit('minute_tick', message);
//       console.log('Emit message:', message);
//     }, 60 * 1000);
//   }
// }
