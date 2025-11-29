import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class BoxService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllBoxes() {
    return this.prisma.box.findMany();
  }

  async createBox(data: { name: string; size: number }) {}
}
