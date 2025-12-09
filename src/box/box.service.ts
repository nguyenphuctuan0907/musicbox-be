import { Injectable } from '@nestjs/common';
import { AppLogger } from 'libs/log/logger';
import { PrismaService } from 'prisma/prisma.service';

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

  constructor(private readonly prisma: PrismaService) {}

  async upsertStatus(payload: {
    boxId: number;
    minutes: number;
    total: number;
    ts: string;
    client?: string;
  }) {
    const { boxId, minutes, total } = payload;

    if (!boxId) return;

    // Tìm bill đang mở của phòng này
    let bill = await this.prisma.bill.findFirst({
      where: {
        boxId,
        status: "draft", // hóa đơn đang mở
      },
    });

    // Nếu chưa có bill -> tạo mới
    if (!bill) {
      bill = await this.prisma.bill.create({
        data: {
          boxId,
          creatorId: 1, // hoặc user hiện tại
          start: Date.now(),
          subtotal: total, // hoặc 0 tùy workflow
          discountAmount: 0,
          total: total,
        },
      });

      this.logger.debug(`Created new bill for box ${boxId}: ${bill.id}`);
    }

    // Nếu có bill -> update
    const updated = await this.prisma.bill.update({
      where: { id: bill.id },
      data: {
        end: null,
        subtotal: total, // có thể khác tùy cách tính subtotal
        total: total,
        // minutes không có field riêng => bạn không thể lưu trực tiếp.
        // Nếu muốn lưu minutes -> phải thêm trường vào DB (gợi ý dưới)
        // updatedAt: new Date() // Prisma auto handle nếu bạn có @updatedAt
      },
    });

    this.logger.debug(`Updated bill status for box ${boxId}: ${updated.id}`);

    return updated;
  }

  getStatus(id: number) {
    return this.prisma.box.findUnique({ where: { id } });
  }

  getAll() {
    return this.prisma.box.findMany();
  }
}
