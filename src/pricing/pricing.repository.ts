import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PricingRepository {
  constructor(private readonly prisma: PrismaService) {}

  createSnapshot(productId: string, price: number | null, inStock: boolean) {
    return this.prisma.priceSnapshot.create({
      data: {
        productId,
        price: price === null ? null : new Prisma.Decimal(price),
        inStock,
      },
    });
  }

  findLatestSnapshot(productId: string) {
    return this.prisma.priceSnapshot.findFirst({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
