import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const passportStrategy: StrategyOptions = {
      secretOrKey: 'superSecret',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    };
    super(passportStrategy);
  }
}
