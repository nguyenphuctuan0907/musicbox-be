import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BoxService } from './box/box.service';
import { PriceService } from './price/price.service';
import { DishService } from './dish/dish.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const boxService = app.get(BoxService);
  const priceService = app.get(PriceService);
  const dishService = app.get(DishService);

  await boxService.seed();
  await priceService.seed();
  await dishService.seed();

  console.log('Seed boxes success');

  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
