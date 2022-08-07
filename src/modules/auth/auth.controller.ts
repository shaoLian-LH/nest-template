import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignResult } from './types.d';
@ApiTags('权限认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  signup(@Body() authCredentialsDto: AuthCredentialsDto): Promise<SignResult> {
    return this.authService.signup(authCredentialsDto);
  }
}
