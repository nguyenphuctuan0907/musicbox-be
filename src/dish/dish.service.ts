import { Injectable } from '@nestjs/common';
import { Dish } from 'generated/prisma/browser';
import { Prisma } from 'generated/prisma/client';
import { AppError } from 'libs/error/base.error';
import { AppLogger } from 'libs/log/logger';
import { PrismaService } from 'prisma/prisma.service';
import { DATA_DEFAULT } from './seed';

@Injectable()
export class DishService {
  private readonly logger = new AppLogger(DishService.name);
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @param data - data to create a new bill
   * @returns the created bill
   */

  async getAllDishs(): Promise<Dish[]> {
    return this.prisma.dish.findMany();
  }

  seed() {
    return this.prisma.dish.createMany({
      data: DATA_DEFAULT as any,
    });
  }
}
