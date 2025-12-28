import { Body, Controller, Delete } from '@nestjs/common';
import { BillDishService } from './billDish.service';

@Controller('billDish')
export class BillDishController {
  constructor(private readonly billDishService: BillDishService) {}

  @Delete()
  deleteBillDish(@Body() body) {
    return this.billDishService.deleteBillDish(body);
  }
}
