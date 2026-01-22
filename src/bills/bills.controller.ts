import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { BillsService } from './bills.service';

@Controller('bill')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Get('')
  getBills(@Query('date') date?: string) {
    return this.billsService.getBills({ date });
  }

    @Get(':id')
  getBillById(@Param('id') id: string) {
    return this.billsService.getBillById(id);
  }

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

  @Put('time-start')
  changeTimeStart(@Body() body) {
    return this.billsService.changeTimeStart(body);
  }
}
