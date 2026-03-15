export interface PriceCheckJob {
  productId: string;
  triggeredBy: 'manual' | 'scheduler' | 'notification-retry';
}
