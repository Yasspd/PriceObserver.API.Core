const DEFAULT_DATABASE_URL =
  'postgresql://postgres:postgres@localhost:5432/price_watcher?schema=public';

function parseInteger(value: unknown, fallback: number): number {
  const parsed = Number.parseInt(String(value ?? fallback), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function validateEnvironment(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const validated = {
    ...config,
    PORT: parseInteger(config.PORT, 3000),
    REDIS_PORT: parseInteger(config.REDIS_PORT, 6379),
    ACCESS_TOKEN_TTL_SECONDS: parseInteger(config.ACCESS_TOKEN_TTL_SECONDS, 3600),
    REFRESH_TOKEN_TTL_SECONDS: parseInteger(
      config.REFRESH_TOKEN_TTL_SECONDS,
      604800,
    ),
    DATABASE_URL: String(config.DATABASE_URL ?? DEFAULT_DATABASE_URL),
  };

  process.env.PORT = String(validated.PORT);
  process.env.REDIS_PORT = String(validated.REDIS_PORT);
  process.env.ACCESS_TOKEN_TTL_SECONDS = String(
    validated.ACCESS_TOKEN_TTL_SECONDS,
  );
  process.env.REFRESH_TOKEN_TTL_SECONDS = String(
    validated.REFRESH_TOKEN_TTL_SECONDS,
  );
  process.env.DATABASE_URL = String(validated.DATABASE_URL);

  return validated;
}
