import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggingMiddleware } from './middleware/logging.middleware';

export class CommonModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggingMiddleware).forRoutes('*path');
	}
}
