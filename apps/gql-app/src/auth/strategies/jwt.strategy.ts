import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { authConfig, AuthConfigType } from '../auth.config';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../../../src/user/user.entity';

const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    @Inject(authConfig.KEY) config: AuthConfigType,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${config.domain}.well-known/jwks.json`,
      }),

      jwtFromRequest,
      audience: `${config.audience}`,
      issuer: `${config.issuer}`,
      algorithms: ['RS256'],
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<User> {
    const token = jwtFromRequest(req);
    return this.authService.validateUser(token, payload);
  }
}
