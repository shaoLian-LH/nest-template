import { AuthCredentialsDto } from './../auth/dto/auth-credentials.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { SessionService } from './session.service';
import { ISignInResult } from '../auth/auth.service';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async login(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<ISignInResult> {
    return this.sessionService.login(authCredentialsDto);
  }
}
