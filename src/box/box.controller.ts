import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { BoxService } from './box.service';
import { CreateBoxDto } from './dto/create-box.dto';

@Controller('box')
export class BoxController {
  constructor(private readonly boxService: BoxService) {}

  @Post()
  createBox(@Body() body: CreateBoxDto) {
    return this.boxService.createBox(body);
  }

  @Get()
  getAllBoxes() {
    return this.boxService.getAllBills();
  }

  @Post('upsert-status')
  upsertStatus(@Body() body) {
    return this.boxService.upsertStatus(body);
  }

  @Put('change-box')
  handleChangeBox(@Body() body) {
    return this.boxService.changeBox(body);
  }

  @Get('time-minutes')
  getTimeMinutes() {
    return this.boxService.getTimeMinutes();
  }
}
