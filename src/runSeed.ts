import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BoxService } from './box/box.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const boxService = app.get(BoxService);

  await boxService.seed();

  console.log('Seed boxes success');

  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
