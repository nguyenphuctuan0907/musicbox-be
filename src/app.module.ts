import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ChatGateway, AppService],
})
export class AppModule {}
