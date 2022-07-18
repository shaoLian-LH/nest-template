import { AuthCredentialsDto } from './../auth/dto/auth-credentials.dto';
import { Injectable } from '@nestjs/common';
import { AuthService, ISignInResult } from '../auth/auth.service';

@Injectable()
export class SessionService {
  constructor(private readonly authService: AuthService) {}

  async login(authCredentials: AuthCredentialsDto): Promise<ISignInResult> {
    return this.authService.signIn(authCredentials);
  }
}
