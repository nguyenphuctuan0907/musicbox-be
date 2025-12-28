import { Injectable } from '@nestjs/common';
import { BillDish } from 'generated/prisma/browser';
import { Prisma } from 'generated/prisma/client';
import { AppError } from 'libs/error/base.error';
import { AppLogger } from 'libs/log/logger';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class BillDishService {
  private readonly logger = new AppLogger(BillDishService.name);
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @param data - data to create a new bill
   * @returns the created bill
   */
  async createBillDishUpsert(items: BillDish[], billId) {
    try {
      const res = await this.prisma.$transaction(async (tx) => {
        for (const item of items) {
          const ID = item?.dishId || item.id;
          const dish = await tx.dish.findUnique({
            where: { id: ID },
          });

          if (!dish) continue;
          await tx.billDish.upsert({
            where: {
              billId_dishId: {
                billId,
                dishId: ID,
              },
            },
            update: {
              quantity: item.quantity,
              price: dish.price, // snapshot
            },
            create: {
              billId,
              dishId: ID,
              quantity: item.quantity,
              price: dish.price,
            },
          });
        }
      });
      return res;
    } catch (error) {
      this.logger.error(error || 'Lỗi tạo billDish');
      throw new AppError('Tạo billDish thất bại', 500);
    }
  }

  async deleteBillDish(payload) {
    const { boxId, dishId, isAvailable } = payload;
    const box = await this.prisma.box.findFirst({
      where: { id: boxId },
    });

    if (!box) {
      this.logger.error(`Box with id ${boxId} not found`);
      throw new AppError(`Box with id ${boxId} not found`, 404);
    }

    // Tìm bill đang mở của phòng này
    let bill = await this.prisma.bill.findFirst({
      where: {
        boxId: boxId,
        status: {
          in: ['DRAFT', 'RUNNING', 'PAYING'],
        },
      },
    });

    if (!bill) {
      this.logger.error(`Box without bill with ${boxId} not found`);
      throw new AppError(`Box without bill with ${boxId} not found`, 400);
    }

    if (isAvailable) {
      await this.prisma.box.update({
        where: {
          id: boxId,
        },
        data: {
          status: 'AVAILABLE',
        },
      });

      await this.prisma.bill.update({
        where: {
          id: bill.id,
        },
        data: {
          status: 'CANCELED',
        },
      });
    }

    const deleteBillDish = await this.prisma.billDish.delete({
      where: {
        billId_dishId: {
          billId: bill.id,
          dishId,
        },
      },
    });

    return deleteBillDish;
  }
}
