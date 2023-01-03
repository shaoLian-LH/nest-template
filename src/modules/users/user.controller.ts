import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';
import { UserService } from './user.service';

@ApiTags('用户')
@Controller('users')
@UseGuards(AuthGuard())
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async getAllUser(): Promise<Array<User>> {
		return this.userService.listUsers();
	}
}
