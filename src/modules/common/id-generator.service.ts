import { Injectable, Scope } from '@nestjs/common';
import { snowflakeInstance } from '../../utils/snowflake';  // 使用之前实现的雪花算法

@Injectable({ scope: Scope.REQUEST })
export class IdGeneratorService {
	private _id: string | null = null;
	private readonly snowflake = snowflakeInstance;

	get id(): string {
		if (!this._id) {
			this._id = this.snowflake.nextId();
		}
		return this._id;
	}

	resetId() {
		this._id = this.snowflake.nextId();
	}

	getOtherId() {
		return this.snowflake.nextId();
	}
}
