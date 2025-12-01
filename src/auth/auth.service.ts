/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppError } from 'libs/error/base.error';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(body: { username: string; password: string }) {
    if (!body) {
      throw new AppError('Vui lòng nhập đầy đủ thông tin!', 400);
    }
    const { username, password } = body;
    const user = await this.prisma.user.findFirst({
      where: { username },
    });

    if (!user) {
      throw new AppError('Username không tồn tại!', 404);
    }

    if (user?.password !== password) {
      throw new AppError('Mật khẩu không đúng!', 401);
    }

    const payload = { id: user.id, username: user.username, role: user.role };
    const token: string = await this.jwtService.signAsync(payload);

    return {
      code: 200,
      message: 'Đăng nhập thành công!',
      user,
      token,
    };
  }
}
