import { Injectable } from '@nestjs/common';

@Injectable()
export class StockBackEvaluator {
  matches(previousInStock: boolean, currentInStock: boolean): boolean {
    return !previousInStock && currentInStock;
  }
}
