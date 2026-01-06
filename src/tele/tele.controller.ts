import { Body, Controller, Get } from '@nestjs/common';
import { TeleService } from './tele.service';

@Controller('notify-tele')
export class TeleController {
  constructor(private readonly teleService: TeleService) {}

  @Get()
  sendMessage(@Body() body: any) {
    return this.teleService.sendMessage(body.message);
  }
}
