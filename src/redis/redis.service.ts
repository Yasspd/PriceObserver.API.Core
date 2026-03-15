import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis | null = null;

  constructor(private readonly configService: ConfigService) {}

  getBullConnectionOptions() {
    return {
      host: this.configService.get<string>('redis.host') ?? '127.0.0.1',
      port: this.configService.get<number>('redis.port') ?? 6379,
      password: this.configService.get<string>('redis.password') ?? undefined,
      db: this.configService.get<number>('redis.db') ?? 0,
      maxRetriesPerRequest: null,
    };
  }

  getClient(): Redis {
    if (!this.client) {
      this.client = new Redis({
        ...this.getBullConnectionOptions(),
        lazyConnect: true,
      });
    }

    return this.client;
  }

  async ping(): Promise<string> {
    return this.getClient().ping();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.quit();
    }
  }
}
