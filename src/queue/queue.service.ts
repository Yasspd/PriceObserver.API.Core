import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';

import { QUEUE_NAMES } from '../common/constants/queue-names';
import { RedisService } from '../redis/redis.service';
import { PriceCheckJob } from '../monitoring/jobs/price-check.job';

@Injectable()
export class QueueService implements OnModuleDestroy {
  private readonly queues = new Map<string, Queue>();

  constructor(private readonly redisService: RedisService) {}

  async enqueuePriceCheck(job: PriceCheckJob) {
    return this.getQueue(QUEUE_NAMES.PRICE_CHECKS).add('price-check', job);
  }

  async enqueueNotification(notificationEventId: string) {
    return this.getQueue(QUEUE_NAMES.NOTIFICATIONS).add('notification-send', {
      notificationEventId,
    });
  }

  private getQueue(name: string): Queue {
    const existingQueue = this.queues.get(name);

    if (existingQueue) {
      return existingQueue;
    }

    const queue = new Queue(name, {
      connection: this.redisService.getBullConnectionOptions(),
    });

    this.queues.set(name, queue);
    return queue;
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.all([...this.queues.values()].map((queue) => queue.close()));
  }
}
