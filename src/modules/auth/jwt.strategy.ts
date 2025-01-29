import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { JwtConfiguration } from '../../config/app/configuration';
import { UserRepositoryService } from '../users/user-repository.service';
import { JwtPayload } from './jwt.interface';
import { User } from '@prisma/client';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly userRepository: UserRepositoryService,
		private readonly configService: ConfigService,
	) {
		const jwtSetting = configService.get<JwtConfiguration>('jwt');
		const passportStrategy: StrategyOptions = {
			secretOrKey: jwtSetting.secret,
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			...jwtSetting.signOptions,
		};
		super(passportStrategy);
	}

	async validate(payload: JwtPayload): Promise<User> {
		console.log('validate - payload - ', payload)
		const { name } = payload;
		const user = await this.userRepository.findOne({ name });
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}
