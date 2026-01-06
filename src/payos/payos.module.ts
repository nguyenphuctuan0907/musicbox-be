import { Module } from '@nestjs/common';
import { PayosService } from './payos.service';
import { PrismaModule } from 'prisma/prisma.module';
import { PayosController } from './payos.controller';
import { BillsService } from 'src/bills/bills.service';
import { ChatGateway } from 'src/chat.gateway';
import { TeleService } from 'src/tele/tele.service';

@Module({
  imports: [PrismaModule],
  controllers: [PayosController],
  providers: [PayosService, BillsService, ChatGateway, TeleService],
  exports: [PayosService],
})
export class PayosModule {}
