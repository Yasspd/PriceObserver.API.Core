"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const client_1 = require("@prisma/client");
const event_names_1 = require("../common/constants/event-names");
const notification_channel_enum_1 = require("../common/constants/notification-channel.enum");
const queue_service_1 = require("../queue/queue.service");
const watch_rules_service_1 = require("../watch-rules/watch-rules.service");
const email_channel_1 = require("./channels/email.channel");
const telegram_channel_1 = require("./channels/telegram.channel");
const webhook_channel_1 = require("./channels/webhook.channel");
const notifications_repository_1 = require("./notifications.repository");
let NotificationsService = class NotificationsService {
    notificationsRepository;
    watchRulesService;
    queueService;
    emailChannel;
    telegramChannel;
    webhookChannel;
    eventEmitter;
    constructor(notificationsRepository, watchRulesService, queueService, emailChannel, telegramChannel, webhookChannel, eventEmitter) {
        this.notificationsRepository = notificationsRepository;
        this.watchRulesService = watchRulesService;
        this.queueService = queueService;
        this.emailChannel = emailChannel;
        this.telegramChannel = telegramChannel;
        this.webhookChannel = webhookChannel;
        this.eventEmitter = eventEmitter;
    }
    getUserNotifications(userId) {
        return this.notificationsRepository.findByUser(userId);
    }
    async createRuleNotifications(event) {
        const createdNotifications = [];
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
                    },
                });
                await this.watchRulesService.registerNotificationSent(matchedRule.id);
                createdNotifications.push(notification.id);
                this.eventEmitter.emit(event_names_1.EVENT_NAMES.NOTIFICATION_CREATED, {
                    notificationEventId: notification.id,
                });
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    continue;
                }
                throw error;
            }
        }
        return createdNotifications;
    }
    async dispatchNotification(notificationEventId) {
        const notification = await this.notificationsRepository.findById(notificationEventId);
        if (!notification) {
            throw new common_1.NotFoundException('Notification event not found');
        }
        try {
            const result = await this.sendThroughChannel(notification.channel, {
                notificationEventId: notification.id,
                payload: notification.payload,
            });
            await this.notificationsRepository.markSent(notification.id);
            await this.queueService.enqueueNotification(notification.id);
            return result;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown notification error';
            await this.notificationsRepository.markFailed(notification.id, message);
            throw new common_1.InternalServerErrorException(message);
        }
    }
    sendTestNotification(userId, dto) {
        return this.sendThroughChannel(dto.channel, {
            userId,
            message: dto.message ?? 'Test notification from PriceWatcher API',
            telegramChatId: dto.telegramChatId,
            webhookUrl: dto.webhookUrl,
        });
    }
    sendThroughChannel(channel, payload) {
        switch (channel) {
            case notification_channel_enum_1.NotificationChannel.EMAIL:
            case 'EMAIL':
                return this.emailChannel.send(payload);
            case notification_channel_enum_1.NotificationChannel.TELEGRAM:
            case 'TELEGRAM':
                return this.telegramChannel.send(payload);
            case notification_channel_enum_1.NotificationChannel.WEBHOOK:
            case 'WEBHOOK':
                return this.webhookChannel.send(payload);
            default:
                throw new common_1.InternalServerErrorException('Unsupported notification channel');
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notifications_repository_1.NotificationsRepository,
        watch_rules_service_1.WatchRulesService,
        queue_service_1.QueueService,
        email_channel_1.EmailChannel,
        telegram_channel_1.TelegramChannel,
        webhook_channel_1.WebhookChannel,
        event_emitter_1.EventEmitter2])
], NotificationsService);
