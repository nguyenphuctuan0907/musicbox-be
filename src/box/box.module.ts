import { Module } from '@nestjs/common';
import { BoxController } from './box.controller';
import { BoxService } from './box.service';
import { PrismaModule } from 'prisma/prisma.module';
import { BoxGateway } from './box.gateway';
import { BillsModule } from 'src/bills/bills.module';
import { BillDishModule } from 'src/billDish/billDish.module';

@Module({
  imports: [PrismaModule, BillsModule, BillDishModule],
  controllers: [BoxController],
  providers: [BoxService, BoxGateway],
  exports: [BoxService, BoxGateway],
})
export class BoxModule {}
