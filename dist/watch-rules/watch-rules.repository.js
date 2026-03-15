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
exports.WatchRulesRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WatchRulesRepository = class WatchRulesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(userId, data) {
        return this.prisma.watchRule.create({
            data: {
                ...data,
                userId,
            },
        });
    }
    findAllByUser(userId, query) {
        return this.prisma.watchRule.findMany({
            where: {
                userId,
                productId: query.productId,
                triggerType: query.triggerType,
                status: query.status,
            },
            include: {
                product: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip: query.skip,
            take: query.limit,
        });
    }
    countByUser(userId, query) {
        return this.prisma.watchRule.count({
            where: {
                userId,
                productId: query.productId,
                triggerType: query.triggerType,
                status: query.status,
            },
        });
    }
    countActiveByUser(userId) {
        return this.prisma.watchRule.count({
            where: {
                userId,
                status: 'ACTIVE',
            },
        });
    }
    findByIdForUser(userId, watchRuleId) {
        return this.prisma.watchRule.findFirst({
            where: {
                id: watchRuleId,
                userId,
            },
            include: {
                product: true,
            },
        });
    }
    update(watchRuleId, data) {
        return this.prisma.watchRule.update({
            where: { id: watchRuleId },
            data,
            include: {
                product: true,
            },
        });
    }
    findActiveByProductId(productId) {
        return this.prisma.watchRule.findMany({
            where: {
                productId,
                status: 'ACTIVE',
            },
        });
    }
    registerNotificationSent(watchRuleId) {
        return this.prisma.watchRule.update({
            where: { id: watchRuleId },
            data: {
                sentNotifications: {
                    increment: 1,
                },
                lastNotifiedAt: new Date(),
            },
        });
    }
};
exports.WatchRulesRepository = WatchRulesRepository;
exports.WatchRulesRepository = WatchRulesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WatchRulesRepository);
