import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EVENT_NAMES } from '../../common/constants/event-names';
import { NotificationsService } from '../notifications.service';

@Injectable()
export class NotificationCreatedListener {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent(EVENT_NAMES.NOTIFICATION_CREATED)
  handleNotificationCreated(payload: { notificationEventId: string }) {
    return this.notificationsService.dispatchNotification(
      payload.notificationEventId,
    );
  }
}
