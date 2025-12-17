import { Injectable } from '@nestjs/common';
import { Bill } from 'generated/prisma/browser';
import { Prisma } from 'generated/prisma/client';
import { AppError } from 'libs/error/base.error';
import { AppLogger } from 'libs/log/logger';
import { PrismaService } from 'prisma/prisma.service';
import { CreateBillDTO } from './dto/create-bill.dto';

@Injectable()
export class BillsService {
  private readonly logger = new AppLogger(BillsService.name);
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @param data - data to create a new bill
   * @returns the created bill
   */
  async createBill(data: CreateBillDTO): Promise<Bill> {
    try {
      const bill = await this.prisma.bill.create({
        data: {
          start: new Date(),
          boxId: data.boxId,
          creatorId: data.creatorId,
          total: 0,
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

  /**
   * @param id - id bill cần cập nhật
   * @param data - data (có thể là một phần của BillUpdateInput hoặc tat cả)
   * @returns bill đã được cập nhật
   */
  async updateBill(id: number, data: Prisma.BillUpdateInput): Promise<Bill> {
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
}
