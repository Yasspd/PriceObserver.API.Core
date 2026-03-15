import { Injectable } from '@nestjs/common';

import { PricingService } from '../../pricing/pricing.service';
import { ProductLock } from '../locks/product.lock';
import { PriceCheckJob } from '../jobs/price-check.job';

@Injectable()
export class PriceCheckWorker {
  constructor(
    private readonly productLock: ProductLock,
    private readonly pricingService: PricingService,
  ) {}

  async process(job: PriceCheckJob) {
    const lockAcquired = await this.productLock.acquire(job.productId);

    if (!lockAcquired) {
      return {
        skipped: true,
        reason: 'product-lock-active',
      };
    }

    try {
      return {
        accepted: true,
        productId: job.productId,
        triggeredBy: job.triggeredBy,
        note: 'Worker skeleton is ready. Queue consumer can call PricingService next.',
        serviceReady: !!this.pricingService,
      };
    } finally {
      await this.productLock.release(job.productId);
    }
  }
}
