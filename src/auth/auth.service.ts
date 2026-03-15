import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { SubscriptionPlanCode } from '../common/constants/plan.enum';
import { compareHash, hashValue } from '../common/utils/hash.util';
import { PlansRepository } from '../plans/plans.repository';
import { AuthRepository, UserWithPlan } from './auth.repository';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly plansRepository: PlansRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(dto: SignUpDto) {
    const existingUser = await this.authRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const defaultPlan = await this.plansRepository.findOrCreateDefaultPlan(
      SubscriptionPlanCode.FREE,
    );

    const user = await this.authRepository.createUser({
      email: dto.email,
      passwordHash: await hashValue(dto.password),
      firstName: dto.firstName,
      lastName: dto.lastName,
      subscriptionPlan: defaultPlan
        ? {
            connect: {
              id: defaultPlan.id,
            },
          }
        : undefined,
    });

    return this.buildAuthResponse(user);
  }

  async signIn(dto: SignInDto) {
    const user = await this.authRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compareHash(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
      }>(dto.refreshToken, {
        secret:
          this.configService.get<string>('auth.jwtRefreshSecret') ??
          'change-me-refresh-secret',
      });

      const user = await this.authRepository.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.buildAuthResponse(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async buildAuthResponse(user: UserWithPlan) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      subscriptionPlanCode: user.subscriptionPlan?.code ?? null,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret:
          this.configService.get<string>('auth.jwtSecret') ??
          'change-me-access-secret',
        expiresIn:
          this.configService.get<number>('auth.accessTokenTtlSeconds') ?? 3600,
      }),
      this.jwtService.signAsync(payload, {
        secret:
          this.configService.get<string>('auth.jwtRefreshSecret') ??
          'change-me-refresh-secret',
        expiresIn:
          this.configService.get<number>('auth.refreshTokenTtlSeconds') ??
          604800,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan?.code ?? null,
      },
    };
  }
}
