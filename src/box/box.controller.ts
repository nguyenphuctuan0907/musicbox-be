import { Body, Controller, Get, Post } from '@nestjs/common';
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
    return this.boxService.getAllBoxes();
  }
}
