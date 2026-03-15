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
exports.WatchRulesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const pagination_meta_dto_1 = require("../common/dto/pagination-meta.dto");
const users_repository_1 = require("../users/users.repository");
const products_repository_1 = require("../products/products.repository");
const cooldown_policy_1 = require("./policies/cooldown.policy");
const expiration_policy_1 = require("./policies/expiration.policy");
const plan_limit_policy_1 = require("./policies/plan-limit.policy");
const watch_rules_repository_1 = require("./watch-rules.repository");
let WatchRulesService = class WatchRulesService {
    watchRulesRepository;
    usersRepository;
    productsRepository;
    planLimitPolicy;
    expirationPolicy;
    cooldownPolicy;
    constructor(watchRulesRepository, usersRepository, productsRepository, planLimitPolicy, expirationPolicy, cooldownPolicy) {
        this.watchRulesRepository = watchRulesRepository;
        this.usersRepository = usersRepository;
        this.productsRepository = productsRepository;
        this.planLimitPolicy = planLimitPolicy;
        this.expirationPolicy = expirationPolicy;
        this.cooldownPolicy = cooldownPolicy;
    }
    async create(userId, dto) {
        const [user, product, activeRulesCount] = await Promise.all([
            this.usersRepository.findById(userId),
            this.productsRepository.findByIdForUser(userId, dto.productId),
            this.watchRulesRepository.countActiveByUser(userId),
        ]);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        this.planLimitPolicy.ensureCanCreate(activeRulesCount, user.subscriptionPlan?.watchRulesLimit);
        return this.watchRulesRepository.create(userId, {
            productId: dto.productId,
            channel: dto.channel ?? 'EMAIL',
            triggerType: dto.triggerType,
            thresholdPrice: dto.thresholdPrice === undefined
                ? undefined
                : new client_1.Prisma.Decimal(dto.thresholdPrice),
            percentDrop: dto.percentDrop,
            onlyOnce: dto.onlyOnce ?? false,
            cooldownHours: dto.cooldownHours,
            expiresAt: dto.expiresAt,
            maxNotifications: dto.maxNotifications,
            status: this.expirationPolicy.isExpired(dto.expiresAt)
                ? 'EXPIRED'
                : 'ACTIVE',
        });
    }
    async findAll(userId, query) {
        const [items, total] = await Promise.all([
            this.watchRulesRepository.findAllByUser(userId, query),
            this.watchRulesRepository.countByUser(userId, query),
        ]);
        return {
            items,
            meta: new pagination_meta_dto_1.PaginationMetaDto(query.page, query.limit, total),
        };
    }
    async findById(userId, watchRuleId) {
        const rule = await this.watchRulesRepository.findByIdForUser(userId, watchRuleId);
        if (!rule) {
            throw new common_1.NotFoundException('Watch rule not found');
        }
        return rule;
    }
    async update(userId, watchRuleId, dto) {
        await this.findById(userId, watchRuleId);
        return this.watchRulesRepository.update(watchRuleId, {
            channel: dto.channel,
            triggerType: dto.triggerType,
            thresholdPrice: dto.thresholdPrice === undefined
                ? undefined
                : new client_1.Prisma.Decimal(dto.thresholdPrice),
            percentDrop: dto.percentDrop,
            onlyOnce: dto.onlyOnce,
            cooldownHours: dto.cooldownHours,
            expiresAt: dto.expiresAt,
            maxNotifications: dto.maxNotifications,
            product: dto.productId === undefined
                ? undefined
                : {
                    connect: {
                        id: dto.productId,
                    },
                },
            status: dto.expiresAt && this.expirationPolicy.isExpired(dto.expiresAt)
                ? 'EXPIRED'
                : undefined,
        });
    }
    canNotify(rule) {
        if (this.expirationPolicy.isExpired(rule.expiresAt)) {
            return false;
        }
        if (!this.cooldownPolicy.canNotify(rule.lastNotifiedAt, rule.cooldownHours)) {
            return false;
        }
        if (rule.onlyOnce && rule.sentNotifications > 0) {
            return false;
        }
        if (typeof rule.maxNotifications === 'number' &&
            rule.sentNotifications >= rule.maxNotifications) {
            return false;
        }
        return true;
    }
    registerNotificationSent(watchRuleId) {
        return this.watchRulesRepository.registerNotificationSent(watchRuleId);
    }
};
exports.WatchRulesService = WatchRulesService;
exports.WatchRulesService = WatchRulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [watch_rules_repository_1.WatchRulesRepository,
        users_repository_1.UsersRepository,
        products_repository_1.ProductsRepository,
        plan_limit_policy_1.PlanLimitPolicy,
        expiration_policy_1.ExpirationPolicy,
        cooldown_policy_1.CooldownPolicy])
], WatchRulesService);
