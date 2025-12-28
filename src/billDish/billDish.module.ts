import { Module } from '@nestjs/common';
import { BillDishService } from './billDish.service';
import { PrismaModule } from 'prisma/prisma.module';
import { BillDishController } from './billDish.controller';

@Module({
  imports: [PrismaModule],
  controllers: [BillDishController],
  providers: [BillDishService],
  exports: [BillDishService],
})
export class BillDishModule {}
