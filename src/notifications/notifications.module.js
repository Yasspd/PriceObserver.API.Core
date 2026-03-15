"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const queue_module_1 = require("../queue/queue.module");
const watch_rules_module_1 = require("../watch-rules/watch-rules.module");
const email_channel_1 = require("./channels/email.channel");
const telegram_channel_1 = require("./channels/telegram.channel");
const webhook_channel_1 = require("./channels/webhook.channel");
const notification_created_listener_1 = require("./listeners/notification-created.listener");
const price_changed_listener_1 = require("./listeners/price-changed.listener");
const notifications_controller_1 = require("./notifications.controller");
const notifications_repository_1 = require("./notifications.repository");
const notifications_service_1 = require("./notifications.service");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [watch_rules_module_1.WatchRulesModule, queue_module_1.QueueModule],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [
            notifications_service_1.NotificationsService,
            notifications_repository_1.NotificationsRepository,
            email_channel_1.EmailChannel,
            telegram_channel_1.TelegramChannel,
            webhook_channel_1.WebhookChannel,
            price_changed_listener_1.PriceChangedListener,
            notification_created_listener_1.NotificationCreatedListener,
        ],
        exports: [notifications_service_1.NotificationsService],
    })
], NotificationsModule);
