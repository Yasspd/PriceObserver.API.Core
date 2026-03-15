import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class PlanLimitPolicy {
  private static readonly DEFAULT_LIMIT = 5;

  resolveLimit(planLimit?: number | null): number {
    return planLimit ?? PlanLimitPolicy.DEFAULT_LIMIT;
  }

  ensureCanCreate(currentRulesCount: number, planLimit?: number | null): void {
    const resolvedLimit = this.resolveLimit(planLimit);

    if (currentRulesCount >= resolvedLimit) {
      throw new ForbiddenException(
        `Watch rules limit reached for the current subscription plan (${resolvedLimit})`,
      );
    }
  }
}
