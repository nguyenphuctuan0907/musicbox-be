import { Body, Controller, Post } from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDTO } from './dto/create-bill.dto';

@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post()
  async creatBill(@Body() body: CreateBillDTO) {
    return this.billsService.createBill(body);
  }
}
