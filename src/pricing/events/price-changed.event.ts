import {
  NotificationChannel,
  WatchTriggerType,
} from '@prisma/client';

export interface MatchedRuleEventPayload {
  id: string;
  userId: string;
  productId: string;
  channel: NotificationChannel;
  triggerType: WatchTriggerType;
  thresholdPrice?: number | null;
  percentDrop?: number | null;
}

export class PriceChangedEvent {
  constructor(
    public readonly productId: string,
    public readonly snapshotId: string,
    public readonly previousPrice: number | null,
    public readonly currentPrice: number | null,
    public readonly previousInStock: boolean,
    public readonly currentInStock: boolean,
    public readonly matchedRules: MatchedRuleEventPayload[],
  ) {}
}
