/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { AppLogger } from 'libs/log/logger';
import { NestApplicationOptions } from '@nestjs/common/interfaces';
import { AllExceptionsFilter } from 'libs/filter/exception.filter';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ZaloService } from './zalo/zalo.service';

async function bootstrap() {
  const logger = new AppLogger();

  const nestAppOpt: NestApplicationOptions = {
    logger: logger,
  };

  const app = await NestFactory.create(AppModule, nestAppOpt);

  app.use(
    bodyParser.json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  const zalo = app.get(ZaloService);

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useWebSocketAdapter(new IoAdapter(app));

  await zalo.start();
  await app.listen(process.env.PORT ?? 3000).then(async () => {
    logger.log('Application is running on: ' + (await app.getUrl()));
  });
}

bootstrap();
