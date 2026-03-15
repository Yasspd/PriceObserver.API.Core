import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a product to track' })
  @ApiCreatedResponse()
  createProduct(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List current user products' })
  @ApiOkResponse()
  getProducts(
    @CurrentUser() user: { userId: string },
    @Query() query: QueryProductsDto,
  ) {
    return this.productsService.findAll(user.userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single tracked product' })
  @ApiOkResponse()
  getProduct(
    @CurrentUser() user: { userId: string },
    @Param('id') productId: string,
  ) {
    return this.productsService.findById(user.userId, productId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tracked product metadata' })
  @ApiOkResponse()
  updateProduct(
    @CurrentUser() user: { userId: string },
    @Param('id') productId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(user.userId, productId, dto);
  }

  @Get(':id/preview-state')
  @ApiOperation({ summary: 'Fetch a mock product state snapshot' })
  @ApiOkResponse()
  previewLatestState(
    @CurrentUser() user: { userId: string },
    @Param('id') productId: string,
  ) {
    return this.productsService.previewLatestState(user.userId, productId);
  }
}
