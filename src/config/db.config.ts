import { registerAs } from '@nestjs/config';

const DEFAULT_DATABASE_URL =
  'postgresql://postgres:postgres@localhost:5432/price_watcher?schema=public';

export const dbConfig = registerAs('db', () => ({
  url: process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL,
}));
