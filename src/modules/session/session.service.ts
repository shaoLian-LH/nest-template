import { AuthCredentialsDto } from './../auth/dto/auth-credentials.dto';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { SignResult } from '../auth/types';

@Injectable()
export class SessionService {
  constructor(private readonly authService: AuthService) {}

  async login(authCredentials: AuthCredentialsDto): Promise<SignResult> {
    return this.authService.signIn(authCredentials);
  }
}
