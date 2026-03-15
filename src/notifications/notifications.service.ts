import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Prisma } from '@prisma/client';

import { EVENT_NAMES } from '../common/constants/event-names';
import { NotificationChannel } from '../common/constants/notification-channel.enum';
import { QueueService } from '../queue/queue.service';
import { WatchRulesService } from '../watch-rules/watch-rules.service';
import { PriceChangedEvent } from '../pricing/events/price-changed.event';
import { EmailChannel } from './channels/email.channel';
import { TelegramChannel } from './channels/telegram.channel';
import { WebhookChannel } from './channels/webhook.channel';
import { SendTestNotificationDto } from './dto/send-test-notification.dto';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly watchRulesService: WatchRulesService,
    private readonly queueService: QueueService,
    private readonly emailChannel: EmailChannel,
    private readonly telegramChannel: TelegramChannel,
    private readonly webhookChannel: WebhookChannel,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  getUserNotifications(userId: string) {
    return this.notificationsRepository.findByUser(userId);
  }

  async createRuleNotifications(event: PriceChangedEvent) {
    const createdNotifications: string[] = [];

    for (const matchedRule of event.matchedRules) {
      try {
        const notification = await this.notificationsRepository.create({
          userId: matchedRule.userId,
          watchRuleId: matchedRule.id,
          productId: matchedRule.productId,
          channel: matchedRule.channel,
          status: 'PENDING',
          deduplicationKey: `${matchedRule.id}:${event.snapshotId}`,
          payload: {
            previousPrice: event.previousPrice,
            currentPrice: event.currentPrice,
            previousInStock: event.previousInStock,
            currentInStock: event.currentInStock,
            triggerType: matchedRule.triggerType,
          } as Prisma.InputJsonValue,
        });

        await this.watchRulesService.registerNotificationSent(matchedRule.id);
        createdNotifications.push(notification.id);
        this.eventEmitter.emit(EVENT_NAMES.NOTIFICATION_CREATED, {
          notificationEventId: notification.id,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          continue;
        }

        throw error;
      }
    }

    return createdNotifications;
  }

  async dispatchNotification(notificationEventId: string) {
    const notification =
      await this.notificationsRepository.findById(notificationEventId);

    if (!notification) {
      throw new NotFoundException('Notification event not found');
    }

    try {
      const result = await this.sendThroughChannel(notification.channel, {
        notificationEventId: notification.id,
        payload: notification.payload,
      });

      await this.notificationsRepository.markSent(notification.id);
      await this.queueService.enqueueNotification(notification.id);

      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown notification error';

      await this.notificationsRepository.markFailed(notification.id, message);
      throw new InternalServerErrorException(message);
    }
  }

  sendTestNotification(userId: string, dto: SendTestNotificationDto) {
    return this.sendThroughChannel(dto.channel, {
      userId,
      message: dto.message ?? 'Test notification from PriceWatcher API',
      telegramChatId: dto.telegramChatId,
      webhookUrl: dto.webhookUrl,
    });
  }

  private sendThroughChannel(
    channel: NotificationChannel | 'EMAIL' | 'TELEGRAM' | 'WEBHOOK',
    payload: Record<string, unknown>,
  ) {
    switch (channel) {
      case NotificationChannel.EMAIL:
      case 'EMAIL':
        return this.emailChannel.send(payload);
      case NotificationChannel.TELEGRAM:
      case 'TELEGRAM':
        return this.telegramChannel.send(payload);
      case NotificationChannel.WEBHOOK:
      case 'WEBHOOK':
        return this.webhookChannel.send(payload);
      default:
        throw new InternalServerErrorException('Unsupported notification channel');
    }
  }
}
