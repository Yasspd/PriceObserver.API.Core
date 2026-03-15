import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

export type UserWithPlan = Prisma.UserGetPayload<{
  include: { subscriptionPlan: true };
}>;

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<UserWithPlan | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { subscriptionPlan: true },
    });
  }

  findById(userId: string): Promise<UserWithPlan | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptionPlan: true },
    });
  }

  createUser(data: Prisma.UserCreateInput): Promise<UserWithPlan> {
    return this.prisma.user.create({
      data,
      include: { subscriptionPlan: true },
    });
  }
}
