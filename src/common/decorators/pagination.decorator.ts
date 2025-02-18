import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 分页参数类
export class Pagination {
	@ApiProperty({
		description: '页码',
		default: 1,
		required: false,
		minimum: 1,
	})
	@Type(() => Number)
	@IsInt({ message: '页码必须是整数' })
	@Min(1, { message: '页码最小值为1' })
	@IsOptional()
	page: number = 1;

	@ApiProperty({
		description: '每页数量',
		default: 10,
		required: false,
		minimum: 1,
	})
	@Type(() => Number)
	@IsInt({ message: '每页数量必须是整数' })
	@Min(1, { message: '每页数量最小值为1' })
	@IsOptional()
	pageSize: number = 10;

	// 获取跳过的记录数
	get skip(): number {
		return (this.page - 1) * this.pageSize;
	}

	// 获取限制数量
	get take(): number {
		return this.pageSize;
	}
}

// 分页装饰器
export const PaginationParams = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): Pagination => {
		const request = ctx.switchToHttp().getRequest();
		const query = request.query;

		const pagination = new Pagination();
		pagination.page = query.page ? parseInt(query.page, 10) : 1;
		pagination.pageSize = query.pageSize ? parseInt(query.pageSize, 10) : 10;

		return pagination;
	},
);