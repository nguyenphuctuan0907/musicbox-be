import { Injectable } from '@nestjs/common';
import { PayOS } from '@payos/node';
import { AppError } from 'libs/error/base.error';
import { AppLogger } from 'libs/log/logger';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PayosService {
  private readonly payos: any;
  private readonly logger = new AppLogger(PayosService.name);

  constructor(private readonly prisma: PrismaService) {
    this.payos = new PayOS({
      clientId: process.env.PAYOS_CLIENT_ID,
      apiKey: process.env.PAYOS_API_KEY,
      checksumKey: process.env.PAYOS_CHECKSUM_KEY,
    });
  }

  async createPayment(order: {
    amount: number;
    description: string;
    orderCode: number;
    returnUrl: string;
    cancelUrl: string;
  }) {
    return await this.payos.paymentRequests.create({
      amount: order.amount,
      description: order.description,
      orderCode: order.orderCode,
      returnUrl: order.returnUrl,
      cancelUrl: order.cancelUrl,
    });
  }

  verifyWebhook(body: string) {
    return this.payos.webhooks.verify(body);
  }

  async updateQrCode(boxId: number, qr: string) {
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
          status: 'PAYING',
        },
      });

      if (!bill) {
        this.logger.error(`Box without bill with ${boxId} not found`);
        throw new AppError(`Box without bill with ${boxId} not found`, 400);
      }

      await this.prisma.bill.update({
        where: {
          id: bill.id,
        },
        data: {
          qrCodeUrl: qr,
        },
      });
    } catch (error) {
      this.logger.error(error || 'Lỗi update qrCode');
      throw new AppError('Update thất bại', 500);
    }
  }
}
