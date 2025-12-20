import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PrismaModule } from 'prisma/prisma.module';
import { PriceController } from './price.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PriceController],
  providers: [PriceService],
  exports: [PriceService],
})
export class PriceModule {}
