import { Injectable } from '@nestjs/common';
import { Bill, BillStatus, PaymentMethod } from 'generated/prisma/browser';
import { Prisma } from 'generated/prisma/client';
import { AppError } from 'libs/error/base.error';
import { AppLogger } from 'libs/log/logger';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class BillsService {
  private readonly logger = new AppLogger(BillsService.name);
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @param data - data to create a new bill
   * @returns the created bill
   */
  async createBill(data: {
    boxId: number;
    creatorId: number;
    subtotal: number;
    discountAmount: number;
    total: number;
    start?: Date;
    status: BillStatus;
    boxPriceId?: number;
  }): Promise<Bill> {
    try {
      const bill = await this.prisma.bill.create({
        data: {
          start: data.start,
          boxId: data.boxId,
          creatorId: data.creatorId,
          subtotal: data.subtotal,
          discountAmount: data.discountAmount,
          total: data.total,
          status: data.status,
          boxPriceId: data.boxPriceId,
        },
      });

      return bill;
    } catch (error) {
      this.logger.error(error || 'Lỗi tạo bill');
      throw new AppError('Tạo bill thất bại', 500);
    }
  }

  async getAllBills(): Promise<Bill[]> {
    return this.prisma.bill.findMany();
  }

  /**
   * @param id - id bill cần lấy
   * @returns bill nếu tìm thấy
   */
  async getBill(id: number): Promise<Bill> {
    const bill = await this.prisma.bill.findUnique({
      where: {
        id,
      },
    });

    if (!bill) {
      this.logger.error(`Không tìm thấy bill với id: ${id}`);
      throw new AppError('Không tìm thấy bill', 404);
    }

    return bill;
  }

  async getBillforBox(id: number): Promise<Bill | null> {
    const bill = await this.prisma.bill.findFirst({
      where: {
        boxId: id,
        status: {
          in: ['DRAFT', 'RUNNING', 'PAYING'],
        },
      },
    });

    return bill;
  }

  /**
   * @param id - id bill cần cập nhật
   * @param data - data (có thể là một phần của BillUpdateInput hoặc tat cả)
   * @returns bill đã được cập nhật
   */
  async updateBill(payload: {
    id: number;
    data: Prisma.BillUpdateInput;
  }): Promise<Bill> {
    const { id, data } = payload;

    try {
      await this.getBill(id);

      return this.prisma.bill.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.logger.error(error || 'Lỗi cập nhật bill');
      throw new AppError('Cập nhật bill thất bại', 500);
    }
  }

  async updateStatusBill(payload: {
    boxId: number;
    data: Prisma.BillUpdateInput;
  }): Promise<Bill> {
    const { boxId, data } = payload;

    try {
      const bill = await this.prisma.bill.findFirst({
        where: {
          boxId,
          status: { in: ['DRAFT', 'RUNNING', 'PAYING'] },
        },
      });

      if (!bill) {
        throw new AppError('Không tìm thấy bill', 404);
      }

      return this.prisma.bill.update({
        where: { id: bill.id },
        data: {
          status: data.status,
          end: data.status === 'PAYING' ? bill.end || new Date() : null,
        },
      });
    } catch (error) {
      this.logger.error(error || 'Lỗi cập nhật bill');
      throw new AppError('Cập nhật bill thất bại', 500);
    }
  }

  async paymentCash(payload: {
    boxId: number;
    total: number;
    paymentMethod: PaymentMethod;
  }) {
    try {
      const { boxId, total, paymentMethod } = payload;
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
          status: 'PAYING',
        },
      });

      if (!bill) {
        this.logger.error(`Box without bill with ${boxId} not found`);
        throw new AppError(`Box without bill with ${boxId} not found`, 400);
      }

      await this.prisma.box.update({
        where: {
          id: boxId,
        },
        data: {
          status: 'AVAILABLE',
        },
      });

      const res = await this.prisma.bill.update({
        where: {
          id: bill.id,
        },
        data: {
          status: 'PAID',
          total: total,
          paymentMethod,
          qrCodeUrl: paymentMethod === 'CASH' ? null : bill.qrCodeUrl,
        },
      });

      return { ...res, name: box.name };
    } catch (err) {
      this.logger.error(`Lỗi server ${err}`);
      throw new AppError(`Box without bill with ${err} not found`, 500);
    }
  }

  async cancelPayment(payload: { boxId: number }) {
    const { boxId } = payload;
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
        status: 'PAYING',
      },
    });

    if (!bill) {
      this.logger.error(`Box without bill with ${boxId} not found`);
      throw new AppError(`Box without bill with ${boxId} not found`, 400);
    }

    await this.prisma.box.update({
      where: {
        id: boxId,
      },
      data: {
        status: 'OCCUPIED',
      },
    });

    const res = await this.prisma.bill.update({
      where: {
        id: bill.id,
      },
      data: {
        status: bill.boxPriceId ? 'RUNNING' : 'DRAFT',
        end: null,
        qrCodeUrl: null,
      },
    });

    return res;
  }

  async updateDiscountBill(payload: {
    boxId: number;
    discountAmount: number;
    discountPercent: number;
    discountType: 'VND' | 'PERCENT';
  }) {
    const { boxId, discountAmount, discountPercent, discountType } = payload;
    try {
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
          status: { in: ['RUNNING', 'PAYING'] },
        },
      });

      if (!bill) {
        this.logger.error(`Box without bill with ${boxId} not found`);
        throw new AppError(`Box without bill with ${boxId} not found`, 400);
      }

      const res = await this.prisma.bill.update({
        where: {
          id: bill.id,
        },
        data: {
          discountAmount,
          discountPercent,
          discountType,
        },
      });

      return res;
    } catch (error) {
      this.logger.error(error || 'Lỗi cập nhật bill');
      throw new AppError('Cập nhật bill thất bại', 500);
    }
  }

  async clearDiscountBill(payload: { boxId: number }) {
    const { boxId } = payload;
    try {
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
          status: { in: ['RUNNING', 'PAYING'] },
        },
      });

      if (!bill) {
        this.logger.error(`Box without bill with ${boxId} not found`);
        throw new AppError(`Box without bill with ${boxId} not found`, 400);
      }

      const res = await this.prisma.bill.update({
        where: {
          id: bill.id,
        },
        data: {
          discountAmount: undefined,
          discountPercent: null,
          discountType: null,
        },
      });

      return res;
    } catch (error) {
      this.logger.error(error || 'Lỗi cập nhật bill');
      throw new AppError('Cập nhật bill thất bại', 500);
    }
  }
}
