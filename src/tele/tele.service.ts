import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AppLogger } from 'libs/log/logger';

@Injectable()
export class TeleService {
  private readonly logger = new AppLogger(TeleService.name);
  private readonly botToken = process.env.TELEGRAM_BOT_TOKEN;
  private readonly chatId = process.env.TELEGRAM_CHAT_ID;

  async sendMessage(message: string) {
    console.log(message, this.botToken, this.chatId);
    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

      await axios.post(url, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML',
      });
    } catch (err) {
      this.logger.error('Telegram send error', err);
    }
  }
}
