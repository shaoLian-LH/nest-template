import { CommonHttpException } from '../../common/advance/http-exception.v1.exception';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { HTTP_ERROR_FLAG } from '../../common/enumeration/custom-http.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { IdGeneratorService } from '../common/id-generator.service';
import { User } from '@prisma/client';
import { BaseRepository } from '../../common/base/base.repository';

@Injectable()
export class UserRepositoryService extends BaseRepository<'User', User> {
	protected readonly modelName = 'User' as const;

	constructor(
		protected readonly prisma: PrismaService,
		private idGeneratorService: IdGeneratorService,
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

		return this.create({
			...userData,
			id: this.idGeneratorService.id,
			createdBy: 'self'
		});
	}

	async listUsers(): Promise<Array<User>> {
		return this.findMany({});
	}
}

