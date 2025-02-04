import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepositoryService } from './user-repository.service';
import { User } from '@prisma/client';
@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepositoryService) { }

	async register(userData: CreateUserDto): Promise<User> {
		return this.userRepository.register(userData);
	}

	async listUsers(): Promise<Omit<User, 'password'>[]> {
		return this.userRepository.listUsers();
	}
}
