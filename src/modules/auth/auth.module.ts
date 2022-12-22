import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { User } from '../../entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Configuration>) => {
        const jwtConfiguration = configService.get<JwtConfiguration>('jwt');
        return {
          secret: jwtConfiguration.secret,
          signOptions: jwtConfiguration.signOptions,
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserRepositoryService, AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
