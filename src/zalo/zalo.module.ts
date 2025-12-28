import { Global, Module } from '@nestjs/common';
import { ZaloService } from './zalo.service';

@Global()
@Module({
  providers: [ZaloService],
  exports: [ZaloService],
})
export class ZaloBotModule {}
