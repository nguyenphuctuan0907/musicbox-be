/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { AppError } from 'libs/error/base.error';
import { AppLogger } from 'libs/log/logger';
import { PrismaService } from 'prisma/prisma.service';
import { BillsService } from 'src/bills/bills.service';
import { BillDishService } from 'src/billDish/billDish.service';
import { CreateBoxDto } from './dto/create-box.dto';
import { DATA_DEFAULT } from './seed';

export type RoomStatusRecord = {
  roomId: string;
  roomNumericId?: number;
  name?: string;
  using?: boolean;
  total?: number;
  minutes?: number;
  ts?: string;
  client?: string;
  lastUpdatedAt: string;
};

@Injectable()
export class BoxService {
  private readonly logger = new AppLogger(BoxService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly billService: BillsService,
    private readonly billDishService: BillDishService,
  ) {}

  async createBox(data: CreateBoxDto) {
    try {
      this.logger.log('Creating new box!');

      if (!data) {
        throw new AppError('No data provided for creating box', 400);
      }

      return await this.prisma.box.create({ data });
    } catch (error) {
      this.logger.error(error.message || 'Error creating box');
      throw new AppError(
        error.message || 'Error creating box',
        error.status || 500,
      );
    }
  }

  async upsertStatus(payload: {
    boxId: number;
    minutes: number;
    total: number;
    boxPriceId?: number;
    start?: Date;
    orders?: [];
  }) {
    const { boxId, minutes, total, boxPriceId } = payload;

    const box = await this.prisma.box.findFirst({
      where: { id: boxId },
    });

    if (!box) {
      this.logger.error(`Box with id ${boxId} not found`);
      throw new AppError(`Box with id ${boxId} not found`, 404);
    }

    // Tìm bill đang mở của phòng này
    let bill = await this.billService.getBillforBox(boxId);
    // Nếu chưa có bill -> tạo mới
    if (!bill) {
      if (payload.start) {
        bill = await this.billService.createBill({
          boxId,
          creatorId: 1, // hoặc user hiện tại
          subtotal: total, // hoặc 0 tùy workflow
          discountAmount: 0,
          total: total,
          start: new Date(),
          status: 'RUNNING',
          boxPriceId,
        });
      } else {
        bill = await this.billService.createBill({
          boxId,
          creatorId: 1, // hoặc user hiện tại
          subtotal: 0, // hoặc 0 tùy workflow
          discountAmount: 0,
          total: total,
          status: 'DRAFT',
        });

        // update billDishs
        await this.billDishService.createBillDishUpsert(
          payload.orders || [],
          bill.id,
        );
      }
      // update box status
      await this.prisma.box.update({
        where: { id: boxId },
        data: {
          status: 'OCCUPIED',
        },
      });

      this.logger.debug(`Created new bill for box ${boxId}: ${bill.id}`);
      return bill;
    }

    // Nếu có bill -> update
    let updated;
    if (payload.start) {
      updated = await this.prisma.bill.update({
        where: { id: bill.id },
        data: {
          boxPriceId: payload.boxPriceId,
          start: bill.start || new Date(),
          status: 'RUNNING',
        },
      });
    } else {
      updated = await this.billDishService.createBillDishUpsert(
        payload.orders || [],
        bill.id,
      );
    }

    this.logger.debug(`Updated bill status for box ${boxId}`);

    return updated;
  }

  async changeBox(payload: { currentBoxId: number; newBoxId: number }) {
    try {
      const { currentBoxId, newBoxId } = payload;
      const box = await this.prisma.box.findFirst({
        where: { id: currentBoxId },
      });

      if (!box) {
        this.logger.error(`Box with id ${currentBoxId} not found`);
        throw new AppError(`Box with id ${currentBoxId} not found`, 404);
      }

      // Tìm bill đang mở của phòng này
      let bill = await this.billService.getBillforBox(currentBoxId);
      if (bill) {
        let newBill = await this.billService.getBillforBox(newBoxId);

        if (newBill)
          throw new AppError(
            `Box with id ${newBoxId} đang không AVAILABLE`,
            400,
          );

        await this.prisma.box.update({
          where: {
            id: currentBoxId,
          },
          data: {
            status: 'AVAILABLE',
          },
        });

        await this.prisma.box.update({
          where: {
            id: newBoxId,
          },
          data: {
            status: 'OCCUPIED',
          },
        });

        const resUpdate = await this.prisma.bill.update({
          where: {
            id: bill.id,
          },
          data: {
            boxId: newBoxId,
            // start: bill.start,
            // end: bill.end,
            // boxId: bill.boxId,
            // total: bill.total,
            // status: bill.status,
            // boxPriceId: bill.boxPriceId,
            // paymentMethod: bill.paymentMethod,
            // qrCodeUrl: bill.qrCodeUrl,
            // discountType: bill.discountType,
            // discountAmount: bill.discountAmount,
            // discountPercent: bill.discountPercent,
          },
        });

        return resUpdate;
      }
    } catch (error) {
      throw new AppError('Lỗi server: ' + error, 500);
    }
  }

  getStatus(id: number) {
    return this.prisma.box.findUnique({ where: { id } });
  }

  getAllBills() {
    return this.prisma.box.findMany({
      include: {
        bill: {
          where: {
            status: {
              in: ['RUNNING', 'DRAFT', 'PAYING'],
            },
          },
          take: 1,
          include: {
            billdish: {
              include: {
                dish: true,
              },
            },
            priceRule: true,
          },
        },
      },
    });
  }

  seed() {
    return this.prisma.box.createMany({
      data: DATA_DEFAULT as any,
      skipDuplicates: true,
    });
  }
}
