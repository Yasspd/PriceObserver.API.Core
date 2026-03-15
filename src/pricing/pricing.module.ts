import { Module } from '@nestjs/common';

import { ProductsModule } from '../products/products.module';
import { WatchRulesModule } from '../watch-rules/watch-rules.module';
import { PricingController } from './pricing.controller';
import { PricingRepository } from './pricing.repository';
import { PricingService } from './pricing.service';
import { PercentDropEvaluator } from './evaluators/percent-drop.evaluator';
import { StockBackEvaluator } from './evaluators/stock-back.evaluator';
import { ThresholdEvaluator } from './evaluators/threshold.evaluator';

@Module({
  imports: [ProductsModule, WatchRulesModule],
  controllers: [PricingController],
  providers: [
    PricingService,
    PricingRepository,
    ThresholdEvaluator,
    PercentDropEvaluator,
    StockBackEvaluator,
  ],
  exports: [PricingService],
})
export class PricingModule {}
