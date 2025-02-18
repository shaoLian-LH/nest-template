You should generate the API.d.ts file for the prisma schema. And should follow the following rules:
1. Do not change the BaseProperties、BaseResponse、ErrorResponse and PaginatedData interface.
2. All the entity properties should have it's comment.
3. After generate the API.d.ts file, you should check does there are any errors.If there are any errors, you should fix them.
4. Also should check does the entity properties have it's comment or some entity do not generate to the file.
5. If a property is optional, you should add a `?` after the property name.

this is the example:
```typescript
declare namespace API {
	interface BaseProperties {
		id: string;
		deleted: boolean;
		createdAt: string;
		updatedAt: string;
		createdBy: string;
		updatedBy: string;
	}

	interface BaseResponse<T> {
		// 状态码
		code: number;
		// 是否成功
		success: boolean;
		// 时间戳
		timestamp: string;
		// 消息
		msg?: string;
		// 数据
		data: T | null;
	}

	interface ErrorResponse {
		// 状态码
		code: number;
		// 是否成功
		success: boolean;
		// 消息
		msg: string;
		// 数据
		data: null
		// 时间戳
		timestamp: string;
		// 版本
		version: string;
	}

	interface PaginatedData<T> {
		// 当前页码
		current: number;
		// 上一页
		prev: number;
		// 下一页
		next: number;
		// 是否有上一页
		hasPrev: boolean;
		// 是否有下一页
		hasNext: boolean;
		// 总记录数
		total: number;
		// 列表
		list: T[];
	}

	// #region 频道
	interface Channel extends BaseProperties {
		// 频道名称
		name: string;
		// 频道描述
		description: string;
		// 是否公开
		public: boolean;
		// 公开范围
		publicScope: string;
	}
	// #endregion
}
```

