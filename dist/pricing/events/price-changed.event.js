"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceChangedEvent = void 0;
class PriceChangedEvent {
    productId;
    snapshotId;
    previousPrice;
    currentPrice;
    previousInStock;
    currentInStock;
    matchedRules;
    constructor(productId, snapshotId, previousPrice, currentPrice, previousInStock, currentInStock, matchedRules) {
        this.productId = productId;
        this.snapshotId = snapshotId;
        this.previousPrice = previousPrice;
        this.currentPrice = currentPrice;
        this.previousInStock = previousInStock;
        this.currentInStock = currentInStock;
        this.matchedRules = matchedRules;
    }
}
exports.PriceChangedEvent = PriceChangedEvent;
