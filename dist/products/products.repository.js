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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsRepository = class ProductsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(userId, data) {
        return this.prisma.product.create({
            data: {
                ...data,
                userId,
            },
        });
    }
    findAllByUser(userId, query) {
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
    countByUser(userId, query) {
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
    findByIdForUser(userId, productId) {
        return this.prisma.product.findFirst({
            where: {
                id: productId,
                userId,
            },
        });
    }
    update(productId, data) {
        return this.prisma.product.update({
            where: { id: productId },
            data,
        });
    }
    updateLatestState(productId, price, lastKnownInStock) {
        return this.prisma.product.update({
            where: { id: productId },
            data: {
                lastKnownPrice: price === null ? null : new client_1.Prisma.Decimal(price),
                lastKnownInStock,
            },
        });
    }
    findById(productId) {
        return this.prisma.product.findUnique({
            where: { id: productId },
        });
    }
};
exports.ProductsRepository = ProductsRepository;
exports.ProductsRepository = ProductsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsRepository);
