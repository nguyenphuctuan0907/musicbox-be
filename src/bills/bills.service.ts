import { Injectable } from '@nestjs/common';
import { BillStatus } from 'generated/prisma/enums';
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
        start: new Date(),
        boxId: data.boxId,
        creatorId: data.creatorId,
        subtotal: data.subtotal,
        discountAmount: data.discountAmount,
        total: data.total,
      },
    });

    return bill;
  }

  async getBill(boxId: number) {
    return this.prisma.bill.findFirst({
      where: {
        status: BillStatus.DRAFT,
        boxId: boxId,
      },
    });
  }

  async updateBill(data) {
    return this.prisma.bill.update(data);
  }
}
