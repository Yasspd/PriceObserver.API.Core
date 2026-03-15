import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { QueryWatchRulesDto } from './dto/query-watch-rules.dto';

export type WatchRuleEntity = Prisma.WatchRuleGetPayload<Record<string, never>>;

@Injectable()
export class WatchRulesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    userId: string,
    data: Omit<Prisma.WatchRuleUncheckedCreateInput, 'id' | 'userId'>,
  ) {
    return this.prisma.watchRule.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  findAllByUser(userId: string, query: QueryWatchRulesDto) {
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

  countByUser(userId: string, query: QueryWatchRulesDto) {
    return this.prisma.watchRule.count({
      where: {
        userId,
        productId: query.productId,
        triggerType: query.triggerType,
        status: query.status,
      },
    });
  }

  countActiveByUser(userId: string) {
    return this.prisma.watchRule.count({
      where: {
        userId,
        status: 'ACTIVE',
      },
    });
  }

  findByIdForUser(userId: string, watchRuleId: string) {
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

  update(watchRuleId: string, data: Prisma.WatchRuleUpdateInput) {
    return this.prisma.watchRule.update({
      where: { id: watchRuleId },
      data,
      include: {
        product: true,
      },
    });
  }

  findActiveByProductId(productId: string) {
    return this.prisma.watchRule.findMany({
      where: {
        productId,
        status: 'ACTIVE',
      },
    });
  }

  registerNotificationSent(watchRuleId: string) {
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
}
