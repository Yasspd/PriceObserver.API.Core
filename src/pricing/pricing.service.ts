import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { EVENT_NAMES } from '../common/constants/event-names';
import { normalizePrice } from '../common/utils/price.util';
import { ProductsRepository } from '../products/products.repository';
import { PriceChangedEvent } from './events/price-changed.event';
import { PriceCheckedEvent } from './events/price-checked.event';
import { PercentDropEvaluator } from './evaluators/percent-drop.evaluator';
import { StockBackEvaluator } from './evaluators/stock-back.evaluator';
import { ThresholdEvaluator } from './evaluators/threshold.evaluator';
import { ManualCheckDto } from './dto/manual-check.dto';
import { PricingRepository } from './pricing.repository';
import { WatchRulesRepository } from '../watch-rules/watch-rules.repository';
import { WatchRulesService } from '../watch-rules/watch-rules.service';

@Injectable()
export class PricingService {
  constructor(
    private readonly pricingRepository: PricingRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly watchRulesRepository: WatchRulesRepository,
    private readonly watchRulesService: WatchRulesService,
    private readonly thresholdEvaluator: ThresholdEvaluator,
    private readonly percentDropEvaluator: PercentDropEvaluator,
    private readonly stockBackEvaluator: StockBackEvaluator,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async manualCheck(userId: string, dto: ManualCheckDto) {
    const product = await this.productsRepository.findByIdForUser(
      userId,
      dto.productId,
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const previousPrice = normalizePrice(product.lastKnownPrice?.toString());
    const previousInStock = product.lastKnownInStock;
    const currentPrice = dto.price ?? previousPrice;
    const currentInStock = dto.inStock ?? previousInStock;

    const snapshot = await this.pricingRepository.createSnapshot(
      product.id,
      currentPrice,
      currentInStock,
    );

    await this.productsRepository.updateLatestState(
      product.id,
      currentPrice,
      currentInStock,
    );

    const activeRules = await this.watchRulesRepository.findActiveByProductId(
      product.id,
    );

    const matchedRules = activeRules
      .filter((rule) => this.watchRulesService.canNotify(rule))
      .filter((rule) => {
        switch (rule.triggerType) {
          case 'PRICE_BELOW':
            return this.thresholdEvaluator.matches(
              currentPrice,
              normalizePrice(rule.thresholdPrice?.toString()),
            );
          case 'PERCENT_DROP':
            return this.percentDropEvaluator.matches(
              previousPrice,
              currentPrice,
              rule.percentDrop,
            );
          case 'BACK_IN_STOCK':
            return this.stockBackEvaluator.matches(
              previousInStock,
              currentInStock,
            );
          default:
            return false;
        }
      })
      .map((rule) => ({
        id: rule.id,
        userId: rule.userId,
        productId: rule.productId,
        channel: rule.channel,
        triggerType: rule.triggerType,
        thresholdPrice: normalizePrice(rule.thresholdPrice?.toString()),
        percentDrop: rule.percentDrop,
      }));

    this.eventEmitter.emit(
      EVENT_NAMES.PRICE_CHECKED,
      new PriceCheckedEvent(product.id, snapshot.id, currentPrice, currentInStock),
    );

    const hasStateChanged =
      previousPrice !== currentPrice || previousInStock !== currentInStock;

    if (hasStateChanged || matchedRules.length > 0) {
      this.eventEmitter.emit(
        EVENT_NAMES.PRICE_CHANGED,
        new PriceChangedEvent(
          product.id,
          snapshot.id,
          previousPrice,
          currentPrice,
          previousInStock,
          currentInStock,
          matchedRules,
        ),
      );
    }

    return {
      productId: product.id,
      snapshotId: snapshot.id,
      previousPrice,
      currentPrice,
      previousInStock,
      currentInStock,
      matchedRules,
    };
  }
}
