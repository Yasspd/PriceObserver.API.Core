import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EVENT_NAMES } from '../../common/constants/event-names';
import { PriceChangedEvent } from '../../pricing/events/price-changed.event';
import { NotificationsService } from '../notifications.service';

@Injectable()
export class PriceChangedListener {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent(EVENT_NAMES.PRICE_CHANGED)
  handlePriceChanged(event: PriceChangedEvent) {
    if (event.matchedRules.length === 0) {
      return;
    }

    return this.notificationsService.createRuleNotifications(event);
  }
}
