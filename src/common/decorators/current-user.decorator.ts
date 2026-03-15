import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Role } from '../constants/role.enum';
import { SubscriptionPlanCode } from '../constants/plan.enum';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: Role;
  subscriptionPlanCode?: SubscriptionPlanCode | null;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const request = context.switchToHttp().getRequest();
    return request.user as AuthenticatedUser;
  },
);
