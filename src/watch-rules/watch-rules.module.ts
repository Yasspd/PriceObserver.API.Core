import { Module } from '@nestjs/common';

import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { CooldownPolicy } from './policies/cooldown.policy';
import { ExpirationPolicy } from './policies/expiration.policy';
import { PlanLimitPolicy } from './policies/plan-limit.policy';
import { WatchRulesController } from './watch-rules.controller';
import { WatchRulesRepository } from './watch-rules.repository';
import { WatchRulesService } from './watch-rules.service';

@Module({
  imports: [UsersModule, ProductsModule],
  controllers: [WatchRulesController],
  providers: [
    WatchRulesService,
    WatchRulesRepository,
    PlanLimitPolicy,
    ExpirationPolicy,
    CooldownPolicy,
  ],
  exports: [
    WatchRulesService,
    WatchRulesRepository,
    PlanLimitPolicy,
    ExpirationPolicy,
    CooldownPolicy,
  ],
})
export class WatchRulesModule {}
