import { Injectable, NestMiddleware } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import chalk from 'chalk';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const startTime = process.hrtime();
    res.on('finish', () => {
      const endTime = process.hrtime(startTime);
      const finalTime = (endTime[0] * 1e2 + endTime[1]) / 1e2;
      Logger.log(
        `${chalk.yellow('[Request-response time]')} ${chalk.green(finalTime)}`,
      );
    });
    next();
  }
}
