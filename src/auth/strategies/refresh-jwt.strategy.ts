import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { SubscriptionPlanCode } from '../../common/constants/plan.enum';
import { Role } from '../../common/constants/role.enum';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';

function extractRefreshToken(request: Request): string | null {
  if (request.cookies?.refreshToken) {
    return request.cookies.refreshToken;
  }

  if (typeof request.body?.refreshToken === 'string') {
    return request.body.refreshToken;
  }

  return null;
}

interface RefreshJwtPayload {
  sub: string;
  email: string;
  role: Role;
  subscriptionPlanCode?: SubscriptionPlanCode | null;
}

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractRefreshToken]),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('auth.jwtRefreshSecret') ??
        'change-me-refresh-secret',
      passReqToCallback: false,
    });
  }

  validate(payload: RefreshJwtPayload): AuthenticatedUser {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      subscriptionPlanCode: payload.subscriptionPlanCode ?? null,
    };
  }
}
