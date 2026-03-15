import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PaginationMetaDto } from '../common/dto/pagination-meta.dto';
import { UsersRepository } from '../users/users.repository';
import { ProductsRepository } from '../products/products.repository';
import { CreateWatchRuleDto } from './dto/create-watch-rule.dto';
import { QueryWatchRulesDto } from './dto/query-watch-rules.dto';
import { UpdateWatchRuleDto } from './dto/update-watch-rule.dto';
import { CooldownPolicy } from './policies/cooldown.policy';
import { ExpirationPolicy } from './policies/expiration.policy';
import { PlanLimitPolicy } from './policies/plan-limit.policy';
import { WatchRulesRepository } from './watch-rules.repository';

@Injectable()
export class WatchRulesService {
  constructor(
    private readonly watchRulesRepository: WatchRulesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly planLimitPolicy: PlanLimitPolicy,
    private readonly expirationPolicy: ExpirationPolicy,
    private readonly cooldownPolicy: CooldownPolicy,
  ) {}

  async create(userId: string, dto: CreateWatchRuleDto) {
    const [user, product, activeRulesCount] = await Promise.all([
      this.usersRepository.findById(userId),
      this.productsRepository.findByIdForUser(userId, dto.productId),
      this.watchRulesRepository.countActiveByUser(userId),
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    this.planLimitPolicy.ensureCanCreate(
      activeRulesCount,
      user.subscriptionPlan?.watchRulesLimit,
    );

    return this.watchRulesRepository.create(userId, {
      productId: dto.productId,
      channel: dto.channel ?? 'EMAIL',
      triggerType: dto.triggerType,
      thresholdPrice:
        dto.thresholdPrice === undefined
          ? undefined
          : new Prisma.Decimal(dto.thresholdPrice),
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

  async findAll(userId: string, query: QueryWatchRulesDto) {
    const [items, total] = await Promise.all([
      this.watchRulesRepository.findAllByUser(userId, query),
      this.watchRulesRepository.countByUser(userId, query),
    ]);

    return {
      items,
      meta: new PaginationMetaDto(query.page, query.limit, total),
    };
  }

  async findById(userId: string, watchRuleId: string) {
    const rule = await this.watchRulesRepository.findByIdForUser(userId, watchRuleId);

    if (!rule) {
      throw new NotFoundException('Watch rule not found');
    }

    return rule;
  }

  async update(userId: string, watchRuleId: string, dto: UpdateWatchRuleDto) {
    await this.findById(userId, watchRuleId);

    return this.watchRulesRepository.update(watchRuleId, {
      channel: dto.channel,
      triggerType: dto.triggerType,
      thresholdPrice:
        dto.thresholdPrice === undefined
          ? undefined
          : new Prisma.Decimal(dto.thresholdPrice),
      percentDrop: dto.percentDrop,
      onlyOnce: dto.onlyOnce,
      cooldownHours: dto.cooldownHours,
      expiresAt: dto.expiresAt,
      maxNotifications: dto.maxNotifications,
      product:
        dto.productId === undefined
          ? undefined
          : {
              connect: {
                id: dto.productId,
              },
            },
      status:
        dto.expiresAt && this.expirationPolicy.isExpired(dto.expiresAt)
          ? 'EXPIRED'
          : undefined,
    });
  }

  canNotify(rule: {
    lastNotifiedAt?: Date | null;
    cooldownHours?: number | null;
    expiresAt?: Date | null;
    maxNotifications?: number | null;
    sentNotifications: number;
    onlyOnce: boolean;
  }): boolean {
    if (this.expirationPolicy.isExpired(rule.expiresAt)) {
      return false;
    }

    if (!this.cooldownPolicy.canNotify(rule.lastNotifiedAt, rule.cooldownHours)) {
      return false;
    }

    if (rule.onlyOnce && rule.sentNotifications > 0) {
      return false;
    }

    if (
      typeof rule.maxNotifications === 'number' &&
      rule.sentNotifications >= rule.maxNotifications
    ) {
      return false;
    }

    return true;
  }

  registerNotificationSent(watchRuleId: string) {
    return this.watchRulesRepository.registerNotificationSent(watchRuleId);
  }
}
