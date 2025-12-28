import { Body, Controller, Post, Put } from '@nestjs/common';
import { BillsService } from './bills.service';

@Controller('bill')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post()
  updateStatusPaying(@Body() body) {
    return this.billsService.updateStatusBill(body);
  }

  @Post('payment')
  paymentCashed(@Body() body) {
    return this.billsService.paymentCash(body);
  }

  @Put('payment')
  cancelPayment(@Body() body) {
    return this.billsService.cancelPayment(body);
  }

  @Put('discount')
  updateDiscountBill(@Body() body) {
    return this.billsService.updateDiscountBill(body);
  }

  @Put('discount/clear')
  clearDiscountBill(@Body() body) {
    return this.billsService.clearDiscountBill(body);
  }
}
