import { Injectable } from '@nestjs/common';
import { PayOS } from '@payos/node';

@Injectable()
export class PayosService {
  private readonly payos: any;

  constructor() {
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

  verifyWebhook(body: any) {
    return this.payos.webhooks.verify(body);
  }
}
