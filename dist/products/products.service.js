"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const pagination_meta_dto_1 = require("../common/dto/pagination-meta.dto");
const price_util_1 = require("../common/utils/price.util");
const provider_interface_1 = require("./providers/provider.interface");
const products_repository_1 = require("./products.repository");
let ProductsService = class ProductsService {
    productsRepository;
    productDataProvider;
    constructor(productsRepository, productDataProvider) {
        this.productsRepository = productsRepository;
        this.productDataProvider = productDataProvider;
    }
    create(userId, dto) {
        return this.productsRepository.create(userId, {
            title: dto.title,
            url: dto.url,
            externalId: dto.externalId,
            provider: dto.provider ?? 'mock',
            currency: dto.currency ?? 'USD',
        });
    }
    async findAll(userId, query) {
        const [items, total] = await Promise.all([
            this.productsRepository.findAllByUser(userId, query),
            this.productsRepository.countByUser(userId, query),
        ]);
        return {
            items,
            meta: new pagination_meta_dto_1.PaginationMetaDto(query.page, query.limit, total),
        };
    }
    async findById(userId, productId) {
        const product = await this.productsRepository.findByIdForUser(userId, productId);
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async update(userId, productId, dto) {
        await this.findById(userId, productId);
        return this.productsRepository.update(productId, dto);
    }
    async previewLatestState(userId, productId) {
        const product = await this.findById(userId, productId);
        const snapshot = await this.productDataProvider.fetchLatestState(product.url);
        return {
            ...snapshot,
            currentPrice: (0, price_util_1.normalizePrice)(snapshot.price),
        };
    }
    updateLatestState(productId, price, inStock) {
        return this.productsRepository.updateLatestState(productId, price, inStock);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(provider_interface_1.PRODUCT_DATA_PROVIDER)),
    __metadata("design:paramtypes", [products_repository_1.ProductsRepository, Object])
], ProductsService);
