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
exports.PricingService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const event_names_1 = require("../common/constants/event-names");
const price_util_1 = require("../common/utils/price.util");
const products_repository_1 = require("../products/products.repository");
const price_changed_event_1 = require("./events/price-changed.event");
const price_checked_event_1 = require("./events/price-checked.event");
const percent_drop_evaluator_1 = require("./evaluators/percent-drop.evaluator");
const stock_back_evaluator_1 = require("./evaluators/stock-back.evaluator");
const threshold_evaluator_1 = require("./evaluators/threshold.evaluator");
const pricing_repository_1 = require("./pricing.repository");
const watch_rules_repository_1 = require("../watch-rules/watch-rules.repository");
const watch_rules_service_1 = require("../watch-rules/watch-rules.service");
let PricingService = class PricingService {
    pricingRepository;
    productsRepository;
    watchRulesRepository;
    watchRulesService;
    thresholdEvaluator;
    percentDropEvaluator;
    stockBackEvaluator;
    eventEmitter;
    constructor(pricingRepository, productsRepository, watchRulesRepository, watchRulesService, thresholdEvaluator, percentDropEvaluator, stockBackEvaluator, eventEmitter) {
        this.pricingRepository = pricingRepository;
        this.productsRepository = productsRepository;
        this.watchRulesRepository = watchRulesRepository;
        this.watchRulesService = watchRulesService;
        this.thresholdEvaluator = thresholdEvaluator;
        this.percentDropEvaluator = percentDropEvaluator;
        this.stockBackEvaluator = stockBackEvaluator;
        this.eventEmitter = eventEmitter;
    }
    async manualCheck(userId, dto) {
        const product = await this.productsRepository.findByIdForUser(userId, dto.productId);
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const previousPrice = (0, price_util_1.normalizePrice)(product.lastKnownPrice?.toString());
        const previousInStock = product.lastKnownInStock;
        const currentPrice = dto.price ?? previousPrice;
        const currentInStock = dto.inStock ?? previousInStock;
        const snapshot = await this.pricingRepository.createSnapshot(product.id, currentPrice, currentInStock);
        await this.productsRepository.updateLatestState(product.id, currentPrice, currentInStock);
        const activeRules = await this.watchRulesRepository.findActiveByProductId(product.id);
        const matchedRules = activeRules
            .filter((rule) => this.watchRulesService.canNotify(rule))
            .filter((rule) => {
            switch (rule.triggerType) {
                case 'PRICE_BELOW':
                    return this.thresholdEvaluator.matches(currentPrice, (0, price_util_1.normalizePrice)(rule.thresholdPrice?.toString()));
                case 'PERCENT_DROP':
                    return this.percentDropEvaluator.matches(previousPrice, currentPrice, rule.percentDrop);
                case 'BACK_IN_STOCK':
                    return this.stockBackEvaluator.matches(previousInStock, currentInStock);
                default:
                    return false;
            }
        })
            .map((rule) => ({
            id: rule.id,
            userId: rule.userId,
            productId: rule.productId,
            channel: rule.channel,
            triggerType: rule.triggerType,
            thresholdPrice: (0, price_util_1.normalizePrice)(rule.thresholdPrice?.toString()),
            percentDrop: rule.percentDrop,
        }));
        this.eventEmitter.emit(event_names_1.EVENT_NAMES.PRICE_CHECKED, new price_checked_event_1.PriceCheckedEvent(product.id, snapshot.id, currentPrice, currentInStock));
        const hasStateChanged = previousPrice !== currentPrice || previousInStock !== currentInStock;
        if (hasStateChanged || matchedRules.length > 0) {
            this.eventEmitter.emit(event_names_1.EVENT_NAMES.PRICE_CHANGED, new price_changed_event_1.PriceChangedEvent(product.id, snapshot.id, previousPrice, currentPrice, previousInStock, currentInStock, matchedRules));
        }
        return {
            productId: product.id,
            snapshotId: snapshot.id,
            previousPrice,
            currentPrice,
            previousInStock,
            currentInStock,
            matchedRules,
        };
    }
};
exports.PricingService = PricingService;
exports.PricingService = PricingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pricing_repository_1.PricingRepository,
        products_repository_1.ProductsRepository,
        watch_rules_repository_1.WatchRulesRepository,
        watch_rules_service_1.WatchRulesService,
        threshold_evaluator_1.ThresholdEvaluator,
        percent_drop_evaluator_1.PercentDropEvaluator,
        stock_back_evaluator_1.StockBackEvaluator,
        event_emitter_1.EventEmitter2])
], PricingService);
