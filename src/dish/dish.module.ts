import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { PrismaModule } from 'prisma/prisma.module';
import { DishController } from './dish.controller';

@Module({
  imports: [PrismaModule],
  controllers: [DishController],
  providers: [DishService],
  exports: [DishService],
})
export class DishModule {}
