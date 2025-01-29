import { Injectable, NestMiddleware } from '@nestjs/common';
import { snowflakeInstance } from '../../utils/snowflake';

@Injectable()
export class CacheReleaseMiddleware implements NestMiddleware {
	use(req: any, res: any, next: () => void) {
		res.on('finish', () => {
			snowflakeInstance.resetCache();
		});
		next();
	}
}
