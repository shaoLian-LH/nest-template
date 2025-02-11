import { CommonHttpException } from '../../common/advance/http-exception.v1.exception';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { HTTP_ERROR_FLAG } from '../../common/enumeration/custom-http.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import { BaseRepository } from '../../common/base/base.repository';
import { snowflakeInstance } from '../../utils/snowflake';

@Injectable()
export class UserRepositoryService extends BaseRepository<'User', User> {
	protected readonly modelName = 'User' as const;

	constructor(
		protected readonly prisma: PrismaService,
	) {
		super(prisma);
	}

	async register(userData: CreateUserDto): Promise<User> {
		const hasExisted = await this.findOne({
			name: userData.name
		});

		if (hasExisted) {
			throw new CommonHttpException<HttpStatus.CREATED>(
				HTTP_ERROR_FLAG.CREATED,
				{ entity: 'user', value: userData.name },
			);
		}

		const userId = snowflakeInstance.nextId(this.modelName);

		return this.create({
			...userData,
			id: userId,
			createdBy: userId
		});
	}

	async listUsers(): Promise<Omit<User, 'password'>[]> {
		return this.findMany({
			select: {
				id: true,
				email: true,
				name: true,
				sex: true,
				age: true,
				phone: true,
				avatar: true,
				forbidden: true,
				deleted: true,
				createdAt: true,
				createdBy: true,
				updatedAt: true,
				updatedBy: true
			}
		});
	}
}

