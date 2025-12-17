import { Injectable } from '@nestjs/common';
import { DishType } from 'generated/prisma/enums';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DishService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllDishes(type: DishType) {
    const condition = type ? { type } : {};
    return this.prismaService.dish.findMany({ where: condition });
  }

  async createDish(data: { name: string; price: number; type: DishType }) {
    return this.prismaService.dish.create({ data });
  }
}
