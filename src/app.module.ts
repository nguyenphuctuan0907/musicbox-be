import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { BoxModule } from './box/box.module';
import { JwtModule } from '@nestjs/jwt';
import { BillsService } from './bills/bills.service';
import { BillsModule } from './bills/bills.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    BoxModule,
    BillsModule,
  ],
  controllers: [AppController],
  providers: [AppService, BillsService],
})
export class AppModule {}
