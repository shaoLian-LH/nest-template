import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { V1Controller } from '../../common/decorators/v1.decorator';
import { UserEntity } from '../../entities/User.entity';
import { UserCommonResponse } from './user.swagger';

@ApiTags('用户')
@ApiBearerAuth('Authorization')
@V1Controller('users')
@UseGuards(AuthGuard())
@ApiExtraModels(UserEntity, UserCommonResponse)
export class UserController {
	constructor(private readonly userService: UserService) { }

	@Get()
	@ApiOperation({ summary: '获取用户列表' })
	@ApiResponse({
		schema: {
			$ref: getSchemaPath(UserCommonResponse),
		}
	})
	async getAllUser(): Promise<Omit<User, 'password'>[]> {
		return this.userService.listUsers();
	}
}
