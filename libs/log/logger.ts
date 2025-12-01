/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConsoleLogger } from '@nestjs/common';
import { ConsoleLoggerOptions } from '@nestjs/common/services/console-logger.service';
import { getLog } from 'nestjs-log';

export class AppLogger extends ConsoleLogger {
  fileLogger: any;

  constructor(context?: string, options?: ConsoleLoggerOptions) {
    super(context ?? 'AppLogger', options ?? {});
    this.fileLogger = getLog(context ?? 'app');
  }

  log(message: any, context?: string) {
    super.log.apply(this, arguments);
    this.fileLogger.info.apply(this.fileLogger, arguments);
  }

  error(message: any, stack?: string, context?: string) {
    super.error.apply(this, arguments);
    this.fileLogger.error.apply(this.fileLogger, arguments);
  }

  warn(message: any, context?: string) {
    super.warn.apply(this, arguments);
    this.fileLogger.warn.apply(this.fileLogger, arguments);
  }

  debug(message: any, context?: string) {
    super.debug.apply(this, arguments);
    this.fileLogger.debug.apply(this.fileLogger, arguments);
  }

  verbose(message: any, context?: string) {
    super.verbose.apply(this, arguments);
    this.fileLogger.verbose.apply(this.fileLogger, arguments);
  }
}
