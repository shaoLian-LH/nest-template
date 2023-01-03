import { SignResult } from './../auth/types.d';
import { AuthCredentialsDto } from './../auth/dto/auth-credentials.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { SessionService } from './session.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('权限认证')
@Controller('session')
export class SessionController {
	constructor(private readonly sessionService: SessionService) {}

	@Post()
	async login(
		@Body() authCredentialsDto: AuthCredentialsDto,
	): Promise<SignResult> {
		return this.sessionService.login(authCredentialsDto);
	}
}
