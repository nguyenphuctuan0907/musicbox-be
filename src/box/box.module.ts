import { Module } from '@nestjs/common';
import { BoxController } from './box.controller';
import { BoxService } from './box.service';
import { PrismaModule } from 'prisma/prisma.module';
import { BoxGateway } from './box.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [BoxController],
  providers: [BoxService, BoxGateway],
  exports: [BoxService],
})
export class BoxModule {}
