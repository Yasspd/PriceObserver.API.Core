import { Module } from '@nestjs/common';

import { QueueModule } from '../queue/queue.module';
import { WatchRulesModule } from '../watch-rules/watch-rules.module';
import { EmailChannel } from './channels/email.channel';
import { TelegramChannel } from './channels/telegram.channel';
import { WebhookChannel } from './channels/webhook.channel';
import { NotificationCreatedListener } from './listeners/notification-created.listener';
import { PriceChangedListener } from './listeners/price-changed.listener';
import { NotificationsController } from './notifications.controller';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [WatchRulesModule, QueueModule],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsRepository,
    EmailChannel,
    TelegramChannel,
    WebhookChannel,
    PriceChangedListener,
    NotificationCreatedListener,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
