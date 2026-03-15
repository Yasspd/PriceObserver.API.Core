"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PercentDropEvaluator = void 0;
const common_1 = require("@nestjs/common");
const price_util_1 = require("../../common/utils/price.util");
let PercentDropEvaluator = class PercentDropEvaluator {
    matches(previousPrice, currentPrice, requiredPercentDrop) {
        const actualPercentDrop = (0, price_util_1.calculatePercentDrop)(previousPrice, currentPrice);
        return (actualPercentDrop !== null &&
            requiredPercentDrop !== null &&
            requiredPercentDrop !== undefined &&
            actualPercentDrop >= requiredPercentDrop);
    }
};
exports.PercentDropEvaluator = PercentDropEvaluator;
exports.PercentDropEvaluator = PercentDropEvaluator = __decorate([
    (0, common_1.Injectable)()
], PercentDropEvaluator);
