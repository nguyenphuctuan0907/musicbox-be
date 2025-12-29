import { Controller, Post, Body, Req, Res, Headers } from '@nestjs/common';
import { PayosService } from './payos.service';
import { ChatGateway } from 'src/chat.gateway';
import { ZaloService } from 'src/zalo/zalo.service';
import { BillsService } from 'src/bills/bills.service';

@Controller('payos')
export class PayosController {
  constructor(
    private readonly payosService: PayosService,
    private readonly zaloService: ZaloService,
    private readonly billsService: BillsService,
    private readonly gateway: ChatGateway,
  ) {}

  // Tạo payment link
  @Post('create-payment')
  async createPayment(@Body() body: any) {
    const { amount, returnUrl, cancelUrl, boxId } = body;
    // const orderCode = Date.now(); // auto-gen mã đơn hàng
    const orderCode = boxId * 1_000_000 + Math.floor(Math.random() * 1000000);
    const payosRes = await this.payosService.createPayment({
      amount,
      description: `#${orderCode}`,
      orderCode,
      returnUrl,
      cancelUrl,
    });

    await this.payosService.updateQrCode(boxId, payosRes.qrCode);

    return payosRes;
  }

  // Webhook PayOS gửi về
  @Post('webhook')
  async handleWebhook(@Req() req: any) {
    try {
      if (!req.rawBody) {
        throw new Error('Missing rawBody');
      }

      const rawBody = req.rawBody.toString('utf8');

      const body = JSON.parse(rawBody.toString());
      // VERIFY TRƯỚC
      this.payosService.verifyWebhook(body);

      const orderCode = body.data.orderCode;
      const boxId = Math.floor(orderCode / 1_000_000);

      if (body.success) {
        const res = await this.billsService.paymentCash({
          boxId,
          total: body.data.amount,
          paymentMethod: 'TRANSFER',
        });

        const mess =
          `✅ ${res.name} | 💰 ${body.data.amount.toLocaleString('vi-VN')} VNĐ | ` +
          `💳 CK | ⏰ ${body.data.transactionDateTime} | 📌 ĐÃ TT ${orderCode}`;

        await this.zaloService.sendToGroup('68 Box Đêm', mess);

        this.gateway.emitPaymentStatus(boxId, {
          orderCode,
          status: true,
          amount: body.data.amount,
          boxId,
        });
      }

      return { status: 'success' };
    } catch (err) {
      console.error('Webhook error:', err);
      return { status: 'invalid' };
    }
  }
}
