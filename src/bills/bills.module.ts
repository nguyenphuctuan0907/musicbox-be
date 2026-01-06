import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { PrismaModule } from 'prisma/prisma.module';
import { BillsController } from './bills.controller';
import { BillDishModule } from 'src/billDish/billDish.module';
import { TeleService } from 'src/tele/tele.service';

@Module({
  imports: [PrismaModule, BillDishModule],
  controllers: [BillsController],
  providers: [BillsService, TeleService],
  exports: [BillsService],
})
export class BillsModule {}
