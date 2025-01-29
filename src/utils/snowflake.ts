interface SnowflakeOptions {
	cache?: boolean;
	moduleName: string;
}

interface SnowflakeConfig {
	epoch?: bigint;
	dataCenterId?: bigint;
	workerId?: bigint;
}

interface ParsedId {
	timestamp: number;
	dataCenterId: number;
	workerId: number;
	sequence: number;
}

class SnowflakeError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'SnowflakeError';
	}
}

class Snowflake {
	private readonly epoch: bigint;
	private readonly dataCenterId: bigint;
	private readonly workerId: bigint;

	private sequence: bigint = 0n;
	private lastTimestamp: bigint = -1n;

	// 各部分占位位数
	private readonly workerIdBits: bigint = 5n;
	private readonly dataCenterIdBits: bigint = 5n;
	private readonly sequenceBits: bigint = 12n;

	// 各部分最大值
	private readonly maxWorkerId: bigint = (1n << 5n) - 1n;
	private readonly maxDataCenterId: bigint = (1n << 5n) - 1n;
	private readonly sequenceMask: bigint = (1n << 12n) - 1n;

	// 时间戳左移位数
	private readonly workerIdShift: bigint = this.sequenceBits;
	private readonly dataCenterIdShift: bigint = this.sequenceBits + this.workerIdBits;
	private readonly timestampLeftShift: bigint = this.sequenceBits + this.workerIdBits + this.dataCenterIdBits;

	// 使用 LRU 缓存来存储最近生成的ID
	private static readonly MAX_CACHE_SIZE = 1000;
	private static cache: Map<string, { id: string; timestamp: number }> = new Map();

	constructor(config?: SnowflakeConfig) {
		// 默认值和配置合并
		this.epoch = config?.epoch ?? BigInt(process.env.SNOWFLAKE_EPOCH ?? '1609459200000');
		this.dataCenterId = config?.dataCenterId ?? BigInt(process.env.SNOWFLAKE_DATA_CENTER_ID ?? '1');
		this.workerId = config?.workerId ?? BigInt(process.env.SNOWFLAKE_WORKER_ID ?? '1');

		this.validateConfig();
	}

	private validateConfig(): void {
		if (this.workerId > this.maxWorkerId || this.workerId < 0n) {
			throw new SnowflakeError(`Worker ID 必须在 0 到 ${this.maxWorkerId} 之间`);
		}

		if (this.dataCenterId > this.maxDataCenterId || this.dataCenterId < 0n) {
			throw new SnowflakeError(`DataCenter ID 必须在 0 到 ${this.maxDataCenterId} 之间`);
		}

		const currentTimestamp = BigInt(Date.now());
		if (currentTimestamp < this.epoch) {
			throw new SnowflakeError('Epoch 不能大于当前时间');
		}
	}

	public nextId(options?: SnowflakeOptions): bigint | Promise<bigint> {
		const timestamp = this.getCurrentTimestamp();
		const { cache = true, moduleName } = options || { moduleName: 'default' };

		if (timestamp < this.lastTimestamp) {
			// 时钟回拨处理：等待追赶，最多等待 10ms
			const waitTime = Number(this.lastTimestamp - timestamp);
			if (waitTime <= 10) {
				return this.handleClockMovedBackward(waitTime, options);
			}
			throw new SnowflakeError(`时钟回拨超过容忍范围: ${waitTime}ms`);
		}

		if (timestamp === this.lastTimestamp) {
			this.sequence = (this.sequence + 1n) & this.sequenceMask;
			if (this.sequence === 0n) {
				return this.waitNextMillis(options);
			}
		} else {
			this.sequence = 0n;
		}

		this.lastTimestamp = timestamp;

		const id = this.generateId(timestamp);

		if (cache) {
			this.updateCache(moduleName, id);
		}

		return id;
	}

	private generateId(timestamp: bigint): bigint {
		return ((timestamp - this.epoch) << this.timestampLeftShift) |
			(this.dataCenterId << this.dataCenterIdShift) |
			(this.workerId << this.workerIdShift) |
			this.sequence;
	}

	private getCurrentTimestamp(): bigint {
		return BigInt(Date.now());
	}

	private handleClockMovedBackward(waitTime: number, options?: SnowflakeOptions): Promise<bigint> {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(this.nextId(options));
			}, waitTime);
		});
	}

	private waitNextMillis(options?: SnowflakeOptions): bigint | Promise<bigint> {
		const timestamp = this.tilNextMills(Number(this.lastTimestamp));
		this.sequence = 0n;
		this.lastTimestamp = BigInt(timestamp);
		return this.nextId(options);
	}

	private updateCache(moduleName: string, id: bigint): void {
		if (Snowflake.cache.size >= Snowflake.MAX_CACHE_SIZE) {
			// 删除最早的缓存
			const oldestKey = Snowflake.cache.keys().next().value;
			Snowflake.cache.delete(oldestKey);
		}

		Snowflake.cache.set(moduleName, {
			id: id.toString(),
			timestamp: Date.now()
		});
	}

	private tilNextMills(lastTimestamp: number): number {
		let timestamp = Date.now();
		while (timestamp <= lastTimestamp) {
			timestamp = Date.now();
		}
		return timestamp;
	}

	public resetCache(): void {
		Snowflake.cache.clear();
	}

	public getCacheSize(): number {
		return Snowflake.cache.size;
	}

	// 解析ID，用于调试
	public parseId(id: string | bigint): ParsedId {
		const bigIntId = typeof id === 'string' ? BigInt(id) : id;

		const timestamp = Number((bigIntId >> this.timestampLeftShift) + this.epoch);
		const dataCenterId = Number((bigIntId >> this.dataCenterIdShift) & this.maxDataCenterId);
		const workerId = Number((bigIntId >> this.workerIdShift) & this.maxWorkerId);
		const sequence = Number(bigIntId & this.sequenceMask);

		return {
			timestamp,
			dataCenterId,
			workerId,
			sequence
		};
	}
}

// 导出单例实例
export const snowflakeInstance = new Snowflake();
