import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(username: string) {
    return this.prisma.user.findFirst({ where: { username } });
  }
}
