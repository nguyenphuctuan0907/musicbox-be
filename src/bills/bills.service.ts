import { Injectable } from '@nestjs/common';
import { AppError } from 'libs/error/base.error';
import { AppLogger } from 'libs/log/logger';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class BillsService {
  private readonly logger = new AppLogger(BillsService.name);
  constructor(private readonly prisma: PrismaService) {}

  async createBill(data: {
    boxId: number;
    creatorId: number;
    subtotal: number;
    discountAmount: number;
    total: number;
  }) {
    const bill = await this.prisma.bill.create({
      data: {
        start: Date.now(),
        boxId: data.boxId,
        creatorId: data.creatorId,
        subtotal: data.subtotal,
        discountAmount: data.discountAmount,
        total: data.total,
        status: 'draft',
      },
    });

    return bill;
  }

  async getBill(boxId: number) {
    const bill = await this.prisma.bill.findFirst({
      where: {
        status: 'draft',
        boxId: boxId,
      },
    });

    if (!bill) {
      this.logger.debug(`No open bill found for box ${boxId}`);
      throw new AppError('No open bill found for the specified box.', 404);
    }

    return bill;
  }
}
