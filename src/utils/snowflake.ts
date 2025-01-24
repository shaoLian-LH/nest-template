class Snowflake {
	private readonly epoch: number;
	private readonly dataCenterId: number;
	private readonly workerId: number;

	private sequence: number = 0;
	private lastTimestamp: number = -1;

	// 各部分占位位数
	private readonly workerIdBits: number = 5;
	private readonly dataCenterIdBits: number = 5;
	private readonly sequenceBits: number = 12;

	// 各部分最大值
	private readonly maxWorkerId: number = -1 ^ (-1 << this.workerIdBits);
	private readonly maxdataCenterId: number = -1 ^ (-1 << this.dataCenterIdBits);
	private readonly sequenceMask: number = -1 ^ (-1 << this.sequenceBits);

	// 时间戳左移位数
	private readonly workerIdShift: number = this.sequenceBits;
	private readonly dataCenterIdShift: number = this.sequenceBits + this.workerIdBits;
	private readonly timestampLeftShift: number = this.sequenceBits + this.workerIdBits + this.dataCenterIdBits;

	constructor() {
		// 从环境变量获取配置
		this.epoch = Number(process.env.SNOWFLAKE_EPOCH) || 1609459200000;
		this.dataCenterId = Number(process.env.SNOWFLAKE_DATA_CENTER_ID) || 1;
		this.workerId = Number(process.env.SNOWFLAKE_WORKER_ID) || 1;

		if (this.workerId > this.maxWorkerId || this.workerId < 0) {
			throw new Error(`Worker ID 不能大于 ${this.maxWorkerId} 或小于 0`);
		}

		if (this.dataCenterId > this.maxdataCenterId || this.dataCenterId < 0) {
			throw new Error(`DataCenter ID 不能大于 ${this.maxdataCenterId} 或小于 0`);
		}
	}

	public nextId(): string {
		let timestamp = Date.now();

		if (timestamp < this.lastTimestamp) {
			throw new Error('时钟发生回拨，拒绝生成ID');
		}

		if (timestamp === this.lastTimestamp) {
			this.sequence = (this.sequence + 1) & this.sequenceMask;
			if (this.sequence === 0) {
				// 当前毫秒内计数满了，等待下一毫秒
				timestamp = this.tilNextMills(this.lastTimestamp);
			}
		} else {
			this.sequence = 0;
		}

		this.lastTimestamp = timestamp;

		return String(
			((timestamp - this.epoch) << this.timestampLeftShift) |
			(this.dataCenterId << this.dataCenterIdShift) |
			(this.workerId << this.workerIdShift) |
			this.sequence
		);
	}

	private tilNextMills(lastTimestamp: number): number {
		let timestamp = Date.now();
		while (timestamp <= lastTimestamp) {
			timestamp = Date.now();
		}
		return timestamp;
	}
}

// 导出单例实例
export const snowflakeInstance = new Snowflake();