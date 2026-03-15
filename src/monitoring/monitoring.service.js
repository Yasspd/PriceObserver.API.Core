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
var MonitoringService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringService = void 0;
const common_1 = require("@nestjs/common");
const queue_service_1 = require("../queue/queue.service");
let MonitoringService = MonitoringService_1 = class MonitoringService {
    queueService;
    logger = new common_1.Logger(MonitoringService_1.name);
    constructor(queueService) {
        this.queueService = queueService;
    }
    scheduleProductCheck(productId, triggeredBy) {
        this.logger.log(`Scheduling product check for ${productId}`);
        return this.queueService.enqueuePriceCheck({
            productId,
            triggeredBy,
        });
    }
    enqueueScheduledSweep() {
        this.logger.log('Scheduled monitoring sweep triggered');
        return {
            accepted: true,
            queuedAt: new Date().toISOString(),
        };
    }
};
exports.MonitoringService = MonitoringService;
exports.MonitoringService = MonitoringService = MonitoringService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [queue_service_1.QueueService])
], MonitoringService);
