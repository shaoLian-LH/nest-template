import { Body, Post } from '@nestjs/common';
import { V1Controller } from '../../common/decorators/v1.decorator';
import { User } from '../users/entity/user.entity';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@V1Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  signup(@Body() authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.authService.signup(authCredentialsDto);
  }
}
