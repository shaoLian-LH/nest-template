import { Body, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignResult } from './types.d';
import { V1Controller } from '../../common/decorators/v1.decorator';
import { Public } from '../../common/decorators/public.decorator';
@ApiTags('权限认证')
@V1Controller('auth')
@Public()
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('/actions/sign-up')
	signup(@Body() authCredentialsDto: AuthCredentialsDto): Promise<SignResult> {
		return this.authService.signup(authCredentialsDto);
	}

	@Post('/actions/sign-in')
	signin(@Body() authCredentialsDto: AuthCredentialsDto): Promise<SignResult> {
		return this.authService.signin(authCredentialsDto);
	}
}
