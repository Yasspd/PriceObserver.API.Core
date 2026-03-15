"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceCheckedEvent = void 0;
class PriceCheckedEvent {
    productId;
    snapshotId;
    price;
    inStock;
    constructor(productId, snapshotId, price, inStock) {
        this.productId = productId;
        this.snapshotId = snapshotId;
        this.price = price;
        this.inStock = inStock;
    }
}
exports.PriceCheckedEvent = PriceCheckedEvent;
