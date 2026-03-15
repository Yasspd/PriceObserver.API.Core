import { Injectable } from '@nestjs/common';

import { RedisService } from '../../redis/redis.service';

@Injectable()
export class ProductLock {
  constructor(private readonly redisService: RedisService) {}

  async acquire(productId: string, ttlSeconds = 30): Promise<boolean> {
    const result = await this.redisService
      .getClient()
      .set(`lock:product:${productId}`, '1', 'EX', ttlSeconds, 'NX');

    return result === 'OK';
  }

  async release(productId: string): Promise<void> {
    await this.redisService.getClient().del(`lock:product:${productId}`);
  }
}
