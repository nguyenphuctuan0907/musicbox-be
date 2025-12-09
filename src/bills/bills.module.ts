import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [BillsService],
  exports: [BillsService],
})
export class BillsModule {}
