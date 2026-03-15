"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePrice = normalizePrice;
exports.calculatePercentDrop = calculatePercentDrop;
function normalizePrice(value) {
    if (value === null || value === undefined) {
        return null;
    }
    const parsed = typeof value === 'number' ? value : Number.parseFloat(value);
    return Number.isNaN(parsed) ? null : Number(parsed.toFixed(2));
}
function calculatePercentDrop(previousPrice, currentPrice) {
    if (previousPrice === null ||
        previousPrice === undefined ||
        currentPrice === null ||
        currentPrice === undefined ||
        previousPrice <= 0 ||
        currentPrice >= previousPrice) {
        return null;
    }
    const diff = previousPrice - currentPrice;
    return Number(((diff / previousPrice) * 100).toFixed(2));
}
