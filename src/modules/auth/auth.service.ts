import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './../users/user.repository';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { CommonHttpException } from '../../common/advance/http-exception.v1.exception';
import { HTTP_ERROR_FLAG } from '../../common/enumeration/custom-http.enum';
import { JwtPayload } from './jwt.interface';
import { SignResult } from './types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(authCredentialsDto: AuthCredentialsDto): Promise<SignResult> {
    const { username, password } = authCredentialsDto;
    const salt = genSaltSync();
    const saltedPassword = hashSync(password, salt);
    const newUser = await this.userRepository.register({
      username: username,
      password: saltedPassword,
    });
    const token = this.signJwt({ username: newUser.username });
    return { token };
  }

  signJwt(baseData: JwtPayload) {
    return this.jwtService.sign(baseData);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<SignResult> {
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
      const accessToken = this.signJwt({ username });
      return { token: accessToken };
    }

    throw new CommonHttpException<HttpStatus.UNAUTHORIZED>(
      HTTP_ERROR_FLAG.UNAUTHORIZED,
      { entity: 'user' },
    );
  }
}
