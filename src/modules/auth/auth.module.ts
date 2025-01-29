import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {
	Configuration,
	JwtConfiguration,
} from '../../config/app/configuration';
import { UserRepositoryService } from '../users/user-repository.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			imports: [],
			inject: [ConfigService],
			useFactory: (configService: ConfigService<Configuration>) => {
				const jwtConfiguration = configService.get<JwtConfiguration>('jwt');
				return {
					secret: jwtConfiguration.secret,
					signOptions: jwtConfiguration.signOptions,
				};
			},
		}),
	],
	providers: [UserRepositoryService, AuthService, JwtStrategy],
	controllers: [AuthController],
	exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule { }