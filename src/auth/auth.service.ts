import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { username },
    });

    if (user?.password !== password) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, username: user.username, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      code: 200,
      message: 'Đăng nhập thành công!',
      user,
      token,
    };
  }
}
