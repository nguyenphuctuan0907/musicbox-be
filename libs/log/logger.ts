import { ConsoleLogger } from '@nestjs/common';
import { ConsoleLoggerOptions } from '@nestjs/common/services/console-logger.service';
import { getLog } from 'nestjs-log';

/**
 * Custom logger: log ra console + file
 */
export class AppLogger extends ConsoleLogger {
  private fileLogger: any;

  constructor(context?: string, options?: ConsoleLoggerOptions) {
    super(context ?? '', options ?? ({} as ConsoleLoggerOptions));
    // this.setLogLevels(['error']);
    this.fileLogger = getLog(context ?? 'app');
  }

  /**
   * LOG
   */
  log(message: any, context?: string) {
    super.log(message, context);
    this.fileLogger.info(message, context);
  }

  /**
   * ERROR
   */
  error(message: any, stack?: string, context?: string) {
    super.error(message, stack, context);
    this.fileLogger.error(message, stack, context);
  }

  /**
   * WARN
   */
  warn(message: any, context?: string) {
    super.warn(message, context);
    this.fileLogger.warn(message, context);
  }

  /**
   * DEBUG
   */
  debug(message: any, context?: string) {
    super.debug(message, context);
    this.fileLogger.debug(message, context);
  }

  /**
   * VERBOSE
   */
  verbose(message: any, context?: string) {
    super.verbose(message, context);
    this.fileLogger.verbose(message, context);
  }
}
