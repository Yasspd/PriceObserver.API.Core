import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: Number.parseInt(process.env.PORT ?? '3000', 10),
  globalPrefix: process.env.API_PREFIX ?? 'api',
  appName: process.env.APP_NAME ?? 'PriceWatcher API',
}));
