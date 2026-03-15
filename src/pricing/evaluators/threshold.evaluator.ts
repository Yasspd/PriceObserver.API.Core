import { Injectable } from '@nestjs/common';

@Injectable()
export class ThresholdEvaluator {
  matches(currentPrice: number | null, thresholdPrice?: number | null): boolean {
    return (
      currentPrice !== null &&
      thresholdPrice !== null &&
      thresholdPrice !== undefined &&
      currentPrice <= thresholdPrice
    );
  }
}
