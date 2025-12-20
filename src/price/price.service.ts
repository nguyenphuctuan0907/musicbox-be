import { Injectable } from '@nestjs/common';
import { BoxPriceInterval } from 'generated/prisma/browser';
import { Prisma } from 'generated/prisma/client';
import { AppError } from 'libs/error/base.error';
import { AppLogger } from 'libs/log/logger';
import { PrismaService } from 'prisma/prisma.service';
import { DATA_DEFAULT } from './seed';

@Injectable()
export class PriceService {
  private readonly logger = new AppLogger(PriceService.name);
  constructor(private readonly prisma: PrismaService) {}

  async getAllPrice(): Promise<BoxPriceInterval[]> {
    return this.prisma.boxPriceInterval.findMany();
  }

  // create default values in DB
  seed() {
    return this.prisma.boxPriceInterval.createMany({
      data: DATA_DEFAULT as any,
    });
  }
}
