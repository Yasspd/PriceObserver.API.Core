import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { QueryProductsDto } from './dto/query-products.dto';

export type ProductEntity = Prisma.ProductGetPayload<Record<string, never>>;

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    userId: string,
    data: Omit<Prisma.ProductUncheckedCreateInput, 'id' | 'userId'>,
  ) {
    return this.prisma.product.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  findAllByUser(userId: string, query: QueryProductsDto) {
    return this.prisma.product.findMany({
      where: {
        userId,
        OR: query.search
          ? [
              { title: { contains: query.search, mode: 'insensitive' } },
              { url: { contains: query.search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: query.skip,
      take: query.limit,
    });
  }

  countByUser(userId: string, query: QueryProductsDto) {
    return this.prisma.product.count({
      where: {
        userId,
        OR: query.search
          ? [
              { title: { contains: query.search, mode: 'insensitive' } },
              { url: { contains: query.search, mode: 'insensitive' } },
            ]
          : undefined,
      },
    });
  }

  findByIdForUser(userId: string, productId: string) {
    return this.prisma.product.findFirst({
      where: {
        id: productId,
        userId,
      },
    });
  }

  update(productId: string, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({
      where: { id: productId },
      data,
    });
  }

  updateLatestState(productId: string, price: number | null, lastKnownInStock: boolean) {
    return this.prisma.product.update({
      where: { id: productId },
      data: {
        lastKnownPrice:
          price === null ? null : new Prisma.Decimal(price),
        lastKnownInStock,
      },
    });
  }

  findById(productId: string) {
    return this.prisma.product.findUnique({
      where: { id: productId },
    });
  }
}
