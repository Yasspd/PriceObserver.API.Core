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
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const queue_names_1 = require("../common/constants/queue-names");
const redis_service_1 = require("../redis/redis.service");
let QueueService = class QueueService {
    redisService;
    queues = new Map();
    constructor(redisService) {
        this.redisService = redisService;
    }
    async enqueuePriceCheck(job) {
        return this.getQueue(queue_names_1.QUEUE_NAMES.PRICE_CHECKS).add('price-check', job);
    }
    async enqueueNotification(notificationEventId) {
        return this.getQueue(queue_names_1.QUEUE_NAMES.NOTIFICATIONS).add('notification-send', {
            notificationEventId,
        });
    }
    getQueue(name) {
        const existingQueue = this.queues.get(name);
        if (existingQueue) {
            return existingQueue;
        }
        const queue = new bullmq_1.Queue(name, {
            connection: this.redisService.getBullConnectionOptions(),
        });
        this.queues.set(name, queue);
        return queue;
    }
    async onModuleDestroy() {
        await Promise.all([...this.queues.values()].map((queue) => queue.close()));
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], QueueService);
