import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { PaginationMetaDto } from '../common/dto/pagination-meta.dto';
import { normalizePrice } from '../common/utils/price.util';
import { PRODUCT_DATA_PROVIDER, ProductDataProvider } from './providers/provider.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    @Inject(PRODUCT_DATA_PROVIDER)
    private readonly productDataProvider: ProductDataProvider,
  ) {}

  create(userId: string, dto: CreateProductDto) {
    return this.productsRepository.create(userId, {
      title: dto.title,
      url: dto.url,
      externalId: dto.externalId,
      provider: dto.provider ?? 'mock',
      currency: dto.currency ?? 'USD',
    });
  }

  async findAll(userId: string, query: QueryProductsDto) {
    const [items, total] = await Promise.all([
      this.productsRepository.findAllByUser(userId, query),
      this.productsRepository.countByUser(userId, query),
    ]);

    return {
      items,
      meta: new PaginationMetaDto(query.page, query.limit, total),
    };
  }

  async findById(userId: string, productId: string) {
    const product = await this.productsRepository.findByIdForUser(userId, productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(userId: string, productId: string, dto: UpdateProductDto) {
    await this.findById(userId, productId);
    return this.productsRepository.update(productId, dto);
  }

  async previewLatestState(userId: string, productId: string) {
    const product = await this.findById(userId, productId);
    const snapshot = await this.productDataProvider.fetchLatestState(product.url);

    return {
      ...snapshot,
      currentPrice: normalizePrice(snapshot.price),
    };
  }

  updateLatestState(productId: string, price: number | null, inStock: boolean) {
    return this.productsRepository.updateLatestState(productId, price, inStock);
  }
}
