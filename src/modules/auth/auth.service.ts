import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './../users/user.repository';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { User } from '../users/entity/user.entity';
import { CommonHttpException } from '../../common/advance/http-exception.v1.exception';
import { HTTP_ERROR_FLAG } from '../../common/enumeration/custom-http.enum';
import { JwtPayload } from './jwt.interface';

export interface ISignInResult {
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;
    const salt = genSaltSync();
    const saltedPassword = hashSync(password, salt);
    return this.userRepository.register({
      username: username,
      password: saltedPassword,
    });
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<ISignInResult> {
    const { username, password } = authCredentialsDto;
    const userInfo = await this.userRepository.findOne({ where: { username } });

    if (!userInfo) {
      throw new CommonHttpException<HttpStatus.NOT_FOUND>(
        HTTP_ERROR_FLAG.NOT_FOUND,
        { entity: 'user' },
      );
    }

    const comparedResult = compareSync(password, userInfo.password);

    if (comparedResult) {
      const payload: JwtPayload = { username };
      const accessToken = this.jwtService.sign(payload);
      return { token: accessToken };
    }

    throw new CommonHttpException<HttpStatus.UNAUTHORIZED>(
      HTTP_ERROR_FLAG.UNAUTHORIZED,
      { entity: 'user' },
    );
  }
}
