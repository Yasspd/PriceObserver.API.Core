export interface ProductStateSnapshot {
  title?: string;
  price: number | null;
  inStock: boolean;
  currency?: string;
  checkedAt: Date;
}

export interface ProductDataProvider {
  fetchLatestState(url: string): Promise<ProductStateSnapshot>;
}

export const PRODUCT_DATA_PROVIDER = 'PRODUCT_DATA_PROVIDER';
