import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

export type UserProfile = Prisma.UserGetPayload<{
  include: { subscriptionPlan: true };
}>;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(userId: string): Promise<UserProfile | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptionPlan: true },
    });
  }

  updateProfile(
    userId: string,
    data: Pick<Prisma.UserUpdateInput, 'firstName' | 'lastName' | 'timezone'>,
  ): Promise<UserProfile> {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      include: { subscriptionPlan: true },
    });
  }

  updateSettings(
    userId: string,
    data: Pick<
      Prisma.UserUpdateInput,
      | 'emailNotificationsEnabled'
      | 'telegramNotificationsEnabled'
      | 'webhookNotificationsEnabled'
      | 'telegramChatId'
      | 'webhookUrl'
    >,
  ): Promise<UserProfile> {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      include: { subscriptionPlan: true },
    });
  }
}
