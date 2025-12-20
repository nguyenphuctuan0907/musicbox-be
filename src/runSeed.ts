import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BoxService } from './box/box.service';
import { PriceService } from './price/price.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const boxService = app.get(BoxService);
  const priceService = app.get(PriceService);

  await boxService.seed();
  await priceService.seed();

  console.log('Seed boxes success');

  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
