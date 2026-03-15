import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET ?? 'change-me-access-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change-me-refresh-secret',
  accessTokenTtlSeconds: Number.parseInt(
    process.env.ACCESS_TOKEN_TTL_SECONDS ?? '3600',
    10,
  ),
  refreshTokenTtlSeconds: Number.parseInt(
    process.env.REFRESH_TOKEN_TTL_SECONDS ?? '604800',
    10,
  ),
}));
