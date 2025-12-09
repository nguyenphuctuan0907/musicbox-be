/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { AppError } from 'libs/error/base.error';
import { AppLogger } from 'libs/log/logger';
import { PrismaService } from 'prisma/prisma.service';
import { BillsService } from 'src/bills/bills.service';
import { CreateBoxDto } from './dto/create-box.dto';

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
    ts: string;
    client?: string;
  }) {
    const { boxId, minutes, total } = payload;

    const box = await this.prisma.box.findFirst({
      where: { id: boxId },
    });

    if (!box) {
      this.logger.error(`Box with id ${boxId} not found`);
      throw new AppError(`Box with id ${boxId} not found`, 404);
    }

    // Tìm bill đang mở của phòng này
    let bill = await this.billService.getBill(boxId);

    // Nếu chưa có bill -> tạo mới
    if (!bill) {
      bill = await this.billService.createBill({
        boxId,
        creatorId: 1, // hoặc user hiện tại
        subtotal: total, // hoặc 0 tùy workflow
        discountAmount: 0,
        total: total,
      });

      this.logger.debug(`Created new bill for box ${boxId}: ${bill.id}`);
      return bill;
    }

    // Nếu có bill -> update
    const updated = await this.prisma.bill.update({
      where: { id: bill.id },
      data: {
        end: null,
        subtotal: total, // có thể khác tùy cách tính subtotal
        total: total,
        timeUsed: minutes,
      },
    });

    this.logger.debug(`Updated bill status for box ${boxId}: ${updated.id}`);

    return updated;
  }

  getStatus(id: number) {
    return this.prisma.box.findUnique({ where: { id } });
  }

  getAllBills() {
    return this.prisma.box.findMany();
  }
}
