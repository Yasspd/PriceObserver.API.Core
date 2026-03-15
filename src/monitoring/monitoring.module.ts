import { Module } from '@nestjs/common';

import { PricingModule } from '../pricing/pricing.module';
import { QueueModule } from '../queue/queue.module';
import { ProductLock } from './locks/product.lock';
import { MonitoringService } from './monitoring.service';
import { SchedulerService } from './scheduler.service';
import { PriceCheckWorker } from './workers/price-check.worker';

@Module({
  imports: [QueueModule, PricingModule],
  providers: [MonitoringService, SchedulerService, ProductLock, PriceCheckWorker],
  exports: [MonitoringService, PriceCheckWorker],
})
export class MonitoringModule {}
