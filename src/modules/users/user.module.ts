import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { UserRepositoryService } from './user-repository.service';
import { IdGeneratorService } from '../common/id-generator.service';

@Module({
	imports: [AuthModule],
	providers: [IdGeneratorService, UserService, UserRepositoryService],
	controllers: [UserController],
})
export class UserModule { }
