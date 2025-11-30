import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogger } from 'libs/log/logger';
import { NestApplicationOptions } from '@nestjs/common/interfaces';

async function bootstrap() {
  const logger = new AppLogger();

  const nestAppOpt: NestApplicationOptions = {
    logger: logger,
  };

  const app = await NestFactory.create(AppModule, nestAppOpt);
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
