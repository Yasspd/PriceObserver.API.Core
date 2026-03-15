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
exports.PriceCheckWorker = void 0;
const common_1 = require("@nestjs/common");
const pricing_service_1 = require("../../pricing/pricing.service");
const product_lock_1 = require("../locks/product.lock");
let PriceCheckWorker = class PriceCheckWorker {
    productLock;
    pricingService;
    constructor(productLock, pricingService) {
        this.productLock = productLock;
        this.pricingService = pricingService;
    }
    async process(job) {
        const lockAcquired = await this.productLock.acquire(job.productId);
        if (!lockAcquired) {
            return {
                skipped: true,
                reason: 'product-lock-active',
            };
        }
        try {
            return {
                accepted: true,
                productId: job.productId,
                triggeredBy: job.triggeredBy,
                note: 'Worker skeleton is ready. Queue consumer can call PricingService next.',
                serviceReady: !!this.pricingService,
            };
        }
        finally {
            await this.productLock.release(job.productId);
        }
    }
};
exports.PriceCheckWorker = PriceCheckWorker;
exports.PriceCheckWorker = PriceCheckWorker = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_lock_1.ProductLock,
        pricing_service_1.PricingService])
], PriceCheckWorker);
