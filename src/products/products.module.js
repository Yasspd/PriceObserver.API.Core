"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const mock_provider_1 = require("./providers/mock.provider");
const provider_interface_1 = require("./providers/provider.interface");
const products_controller_1 = require("./products.controller");
const products_repository_1 = require("./products.repository");
const products_service_1 = require("./products.service");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        controllers: [products_controller_1.ProductsController],
        providers: [
            products_service_1.ProductsService,
            products_repository_1.ProductsRepository,
            mock_provider_1.MockProductProvider,
            {
                provide: provider_interface_1.PRODUCT_DATA_PROVIDER,
                useExisting: mock_provider_1.MockProductProvider,
            },
        ],
        exports: [products_service_1.ProductsService, products_repository_1.ProductsRepository, provider_interface_1.PRODUCT_DATA_PROVIDER],
    })
], ProductsModule);
