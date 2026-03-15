import { Injectable } from '@nestjs/common';
import { Prisma, SubscriptionPlanCode } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

type SubscriptionPlanEntity = Prisma.SubscriptionPlanGetPayload<Record<string, never>>;

const DEFAULT_PLANS: Array<
  Pick<
    SubscriptionPlanEntity,
    'code' | 'name' | 'watchRulesLimit' | 'maxNotificationsPerRule' | 'priority'
  >
> = [
  {
    code: SubscriptionPlanCode.FREE,
    name: 'Free',
    watchRulesLimit: 5,
    maxNotificationsPerRule: 1,
    priority: 0,
  },
  {
    code: SubscriptionPlanCode.BASIC,
    name: 'Basic',
    watchRulesLimit: 20,
    maxNotificationsPerRule: 10,
    priority: 1,
  },
  {
    code: SubscriptionPlanCode.PRO,
    name: 'Pro',
    watchRulesLimit: 100,
    maxNotificationsPerRule: 100,
    priority: 2,
  },
];

@Injectable()
export class PlansRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.subscriptionPlan.findMany({
      orderBy: {
        priority: 'asc',
      },
    });
  }

  findByCode(code: SubscriptionPlanCode) {
    return this.prisma.subscriptionPlan.findUnique({
      where: { code },
    });
  }

  async findOrCreateDefaultPlan(code: SubscriptionPlanCode) {
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
}
