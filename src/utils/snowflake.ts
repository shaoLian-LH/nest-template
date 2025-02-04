import { Snowflake } from '@sapphire/snowflake';

const epoch = new Date('2025-01-29T00:00:00.000Z');
const snowflake = new Snowflake(epoch);

export class SnowflakeUtil {
	private static _instance: SnowflakeUtil;
	private _cache: Map<string, string> = new Map();

	private constructor() {
		snowflake.workerId = Number(process.env.SNOWFLAKE_WORKER_ID || 0);
	}

	public static getInstance() {
		if (!this._instance) {
			this._instance = new SnowflakeUtil();
		}
		return this._instance;
	}

	public nextId(cacheId?: string): string {
		const id = snowflake.generate().toString();
		if (cacheId) {
			this._cache.set(cacheId, id);
		}
		return id;
	}

	public parseId(id: string) {
		const decoded = snowflake.deconstruct(id);
		return {
			timestamp: decoded.timestamp,
			workerId: decoded.workerId,
			processId: decoded.processId,
			increment: decoded.increment,
			epoch: decoded.epoch
		};
	}

	public getByCacheId(cacheId: string) {
		return this._cache.get(cacheId);
	}

	public resetCache() {
		this._cache.clear();
	}
}

// 保持原有导出以兼容旧代码
export const snowflakeInstance = SnowflakeUtil.getInstance();