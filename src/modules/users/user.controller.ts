import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { V1Controller } from '../../common/decorators/v1.decorator';

@ApiTags('用户')
@V1Controller('users')
@UseGuards(AuthGuard())
export class UserController {
	constructor(private readonly userService: UserService) { }

	@Get()
	async getAllUser(): Promise<Array<User>> {
		return this.userService.listUsers();
	}
}
