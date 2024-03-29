import { CommonHttpException } from '../../common/advance/http-exception.v1.exception';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../entities/user.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { HTTP_ERROR_FLAG } from '../../common/enumeration/custom-http.enum';

@Injectable()
export class UserRepositoryService extends Repository<User> {
	constructor(private readonly dataSource: DataSource) {
		super(User, dataSource.createEntityManager());
	}

	async register(userData: CreateUserDto): Promise<User> {
		const hasExisted = await this.findOne({
			where: {
				username: userData.username,
				deleted: 0,
			},
		});

		if (hasExisted) {
			throw new CommonHttpException<HttpStatus.CREATED>(
				HTTP_ERROR_FLAG.CREATED,
				{ entity: 'user', value: userData.username },
			);
		}

		const newUser = this.create(userData);
		await this.save(newUser);

		return newUser;
	}
}
