import { Module } from '@nestjs/common';
import { PayosService } from './payos.service';
import { PrismaModule } from 'prisma/prisma.module';
import { PayosController } from './payos.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PayosController],
  providers: [PayosService],
  exports: [PayosService],
})
export class PayosModule {}
