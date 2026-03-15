import { Injectable } from '@nestjs/common';

import { calculatePercentDrop } from '../../common/utils/price.util';

@Injectable()
export class PercentDropEvaluator {
  matches(
    previousPrice: number | null,
    currentPrice: number | null,
    requiredPercentDrop?: number | null,
  ): boolean {
    const actualPercentDrop = calculatePercentDrop(previousPrice, currentPrice);

    return (
      actualPercentDrop !== null &&
      requiredPercentDrop !== null &&
      requiredPercentDrop !== undefined &&
      actualPercentDrop >= requiredPercentDrop
    );
  }
}
