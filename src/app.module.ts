import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { BoxModule } from './box/box.module';
import { JwtModule } from '@nestjs/jwt';
import { BillsModule } from './bills/bills.module';
import { ChatGateway } from './chat.gateway';
import { PayosModule } from './payos/payos.module';
import { PriceModule } from './price/price.module';
import { BillDishModule } from './billDish/billDish.module';
import { DishModule } from './dish/dish.module';
import { ZaloBotModule } from './zalo/zalo.module';

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
    PriceModule,
    PayosModule,
    BillDishModule,
    DishModule,
    ZaloBotModule,
  ],
  controllers: [AppController],
  providers: [ChatGateway, AppService],
})
export class AppModule {}
