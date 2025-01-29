import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { CacheReleaseMiddleware } from './middleware/cache-release.middleware';

export class CommonModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggingMiddleware).forRoutes('*path');
		consumer.apply(CacheReleaseMiddleware).forRoutes('*path');
	}
}
