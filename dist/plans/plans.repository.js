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
exports.PlansRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const DEFAULT_PLANS = [
    {
        code: client_1.SubscriptionPlanCode.FREE,
        name: 'Free',
        watchRulesLimit: 5,
        maxNotificationsPerRule: 1,
        priority: 0,
    },
    {
        code: client_1.SubscriptionPlanCode.BASIC,
        name: 'Basic',
        watchRulesLimit: 20,
        maxNotificationsPerRule: 10,
        priority: 1,
    },
    {
        code: client_1.SubscriptionPlanCode.PRO,
        name: 'Pro',
        watchRulesLimit: 100,
        maxNotificationsPerRule: 100,
        priority: 2,
    },
];
let PlansRepository = class PlansRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.subscriptionPlan.findMany({
            orderBy: {
                priority: 'asc',
            },
        });
    }
    findByCode(code) {
        return this.prisma.subscriptionPlan.findUnique({
            where: { code },
        });
    }
    async findOrCreateDefaultPlan(code) {
        let plan = await this.findByCode(code);
        if (plan) {
            return plan;
        }
        for (const defaultPlan of DEFAULT_PLANS) {
            plan = await this.prisma.subscriptionPlan.upsert({
                where: { code: defaultPlan.code },
                update: {
                    name: defaultPlan.name,
                    watchRulesLimit: defaultPlan.watchRulesLimit,
                    maxNotificationsPerRule: defaultPlan.maxNotificationsPerRule,
                    priority: defaultPlan.priority,
                },
                create: defaultPlan,
            });
            if (plan.code === code) {
                return plan;
            }
        }
        return null;
    }
};
exports.PlansRepository = PlansRepository;
exports.PlansRepository = PlansRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlansRepository);
