import { ApiProperty } from '@nestjs/swagger';

/**
 * 基础响应格式
 * Base response format
 */
export class BaseResponse {
	@ApiProperty({ description: '状态码', example: 200 })
	code: number;

	@ApiProperty({ description: '是否成功', example: true })
	success: boolean;

	@ApiProperty({ description: '时间戳', example: new Date().toISOString() })
	timestamp: string;

	@ApiProperty({ description: '消息', example: null, required: false })
	msg?: string;
}

/**
 * 分页数据结构
 * Pagination data structure
 */
export class PaginatedData<T = any> {
	@ApiProperty({ description: '当前页码 | Current page', example: 1 })
	current: number;

	@ApiProperty({ description: '上一页 | Previous page', example: 0 })
	prev: number;

	@ApiProperty({ description: '下一页 | Next page', example: 2 })
	next: number;

	@ApiProperty({ description: '是否有上一页 | Has previous page', example: false })
	hasPrev: boolean;

	@ApiProperty({ description: '是否有下一页 | Has next page', example: true })
	hasNext: boolean;

	@ApiProperty({ description: '总记录数 | Total count', example: 100 })
	total: number;

	list: T[]
}