import { HttpException } from '@nestjs/common';

export class AppError extends HttpException {
  constructor(message: string, code?: number) {
    super(message, code ?? 400);
  }
}
