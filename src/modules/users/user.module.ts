import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepositoryService } from './user-repository.service';
import { AuthModule } from '../auth/auth.module';
import { User } from '../../entities/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User]), AuthModule],
	providers: [UserRepositoryService, UserService],
	controllers: [UserController],
})
export class UserModule {}
