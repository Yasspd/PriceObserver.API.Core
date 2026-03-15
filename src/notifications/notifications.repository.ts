import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.NotificationEventUncheckedCreateInput) {
    return this.prisma.notificationEvent.create({
      data,
    });
  }

  findById(notificationEventId: string) {
    return this.prisma.notificationEvent.findUnique({
      where: { id: notificationEventId },
    });
  }

  findByUser(userId: string) {
    return this.prisma.notificationEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  markSent(notificationEventId: string) {
    return this.prisma.notificationEvent.update({
      where: { id: notificationEventId },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        errorMessage: null,
      },
    });
  }

  markFailed(notificationEventId: string, errorMessage: string) {
    return this.prisma.notificationEvent.update({
      where: { id: notificationEventId },
      data: {
        status: 'FAILED',
        errorMessage,
      },
    });
  }
}
