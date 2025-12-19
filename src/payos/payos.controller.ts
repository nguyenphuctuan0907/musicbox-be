import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { PayosService } from './payos.service';
import { ChatGateway } from 'src/chat.gateway';

@Controller('payos')
export class PayosController {
  constructor(
    private readonly payosService: PayosService,
    // private readonly gateway: ChatGateway,
  ) {}

  // Tạo payment link
  @Post('create-payment')
  async createPayment(@Body() body: any) {
    const { amount, returnUrl, cancelUrl, boxId } = body;
    // const orderCode = Date.now(); // auto-gen mã đơn hàng
    const orderCode = boxId * 1_000_000 + Math.floor(Math.random() * 1000000);
    return await this.payosService.createPayment({
      amount,
      description: `#${orderCode}`,
      orderCode,
      returnUrl,
      cancelUrl,
    });
  }

  // Webhook PayOS gửi về
  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    console.log('Body', body);
    try {
      const isValid = await this.payosService.verifyWebhook(body);
      if (!isValid) {
        return { message: 'Invalid webhook' };
      }

      const orderCode = body.data.orderCode;
      const status = body.data.status;
      //  const boxId = payment.boxId;
      // Emit về FE
      // this.gateway.emitPaymentStatus(boxId, {
      //   orderCode,
      //   status,
      //   amount: body.data.amount,
      // });

      // Bạn xử lý logic ở đây: cập nhật database, đơn hàng, gửi notify,...
      console.log('Webhook verified:', isValid);
      return { status: 'success' };
    } catch (err) {
      console.log('err', err);
    }
  }
}
