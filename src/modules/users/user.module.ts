import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { UserRepositoryService } from './user-repository.service';

@Module({
	imports: [AuthModule],
	providers: [UserService, UserRepositoryService],
	controllers: [UserController],
})
export class UserModule { }
