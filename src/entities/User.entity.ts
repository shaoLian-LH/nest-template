import { User } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements User {
	@ApiProperty({ description: 'ID' })
	id: string;

	@ApiProperty({ description: '名称' })
	name: string;

	@ApiProperty({ description: '邮箱' })
	email: string;

	// @ApiProperty({ description: '密码' })
	password: string;

	@ApiProperty({ description: '性别' })
	sex: number;

	@ApiProperty({ description: '年龄' })
	age: number;

	@ApiProperty({ description: '手机号' })
	phone: string;

	@ApiProperty({ description: '头像' })
	avatar: string;

	@ApiProperty({ description: '禁用' })
	forbidden: number;

	@ApiProperty({ description: '删除' })
	deleted: number;

	@ApiProperty({ description: '创建时间' })
	createdAt: Date;

	@ApiProperty({ description: '创建人' })
	createdBy: string;

	@ApiProperty({ description: '更新时间' })
	updatedAt: Date;

	@ApiProperty({ description: '更新人' })
	updatedBy: string;
}
