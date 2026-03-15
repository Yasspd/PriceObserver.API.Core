import { Module } from '@nestjs/common';

import { MockProductProvider } from './providers/mock.provider';
import { PRODUCT_DATA_PROVIDER } from './providers/provider.interface';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsRepository,
    MockProductProvider,
    {
      provide: PRODUCT_DATA_PROVIDER,
      useExisting: MockProductProvider,
    },
  ],
  exports: [ProductsService, ProductsRepository, PRODUCT_DATA_PROVIDER],
})
export class ProductsModule {}
