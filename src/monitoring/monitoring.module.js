"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringModule = void 0;
const common_1 = require("@nestjs/common");
const pricing_module_1 = require("../pricing/pricing.module");
const queue_module_1 = require("../queue/queue.module");
const product_lock_1 = require("./locks/product.lock");
const monitoring_service_1 = require("./monitoring.service");
const scheduler_service_1 = require("./scheduler.service");
const price_check_worker_1 = require("./workers/price-check.worker");
let MonitoringModule = class MonitoringModule {
};
exports.MonitoringModule = MonitoringModule;
exports.MonitoringModule = MonitoringModule = __decorate([
    (0, common_1.Module)({
        imports: [queue_module_1.QueueModule, pricing_module_1.PricingModule],
        providers: [monitoring_service_1.MonitoringService, scheduler_service_1.SchedulerService, product_lock_1.ProductLock, price_check_worker_1.PriceCheckWorker],
        exports: [monitoring_service_1.MonitoringService, price_check_worker_1.PriceCheckWorker],
    })
], MonitoringModule);
