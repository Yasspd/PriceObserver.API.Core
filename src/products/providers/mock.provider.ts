import { Injectable } from '@nestjs/common';

import {
  ProductDataProvider,
  ProductStateSnapshot,
} from './provider.interface';

@Injectable()
export class MockProductProvider implements ProductDataProvider {
  async fetchLatestState(url: string): Promise<ProductStateSnapshot> {
    const seed = url.length;
    const price = Number((seed * 1.37).toFixed(2));

    return {
      title: 'Mock product snapshot',
      price,
      inStock: seed % 2 === 0,
      currency: 'USD',
      checkedAt: new Date(),
    };
  }
}
