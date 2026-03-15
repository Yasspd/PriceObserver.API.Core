"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockProductProvider = void 0;
const common_1 = require("@nestjs/common");
let MockProductProvider = class MockProductProvider {
    async fetchLatestState(url) {
        const seed = url.length;
        const price = Number((seed * 1.37).toFixed(2));
        return {
            title: 'Mock product snapshot',
            price,
            inStock: seed % 2 === 0,
            currency: 'USD',
            checkedAt: new Date(),
        };
    }
};
exports.MockProductProvider = MockProductProvider;
exports.MockProductProvider = MockProductProvider = __decorate([
    (0, common_1.Injectable)()
], MockProductProvider);
