import { Injectable, Logger } from '@nestjs/common';

import { QueueService } from '../queue/queue.service';
import { PriceCheckJob } from './jobs/price-check.job';

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);

  constructor(private readonly queueService: QueueService) {}

  scheduleProductCheck(productId: string, triggeredBy: PriceCheckJob['triggeredBy']) {
    this.logger.log(`Scheduling product check for ${productId}`);
    return this.queueService.enqueuePriceCheck({
      productId,
      triggeredBy,
    });
  }

  enqueueScheduledSweep() {
    this.logger.log('Scheduled monitoring sweep triggered');
    return {
      accepted: true,
      queuedAt: new Date().toISOString(),
    };
  }
}
