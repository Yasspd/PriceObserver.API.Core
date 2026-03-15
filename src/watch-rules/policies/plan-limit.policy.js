"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PlanLimitPolicy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanLimitPolicy = void 0;
const common_1 = require("@nestjs/common");
let PlanLimitPolicy = class PlanLimitPolicy {
    static { PlanLimitPolicy_1 = this; }
    static DEFAULT_LIMIT = 5;
    resolveLimit(planLimit) {
        return planLimit ?? PlanLimitPolicy_1.DEFAULT_LIMIT;
    }
    ensureCanCreate(currentRulesCount, planLimit) {
        const resolvedLimit = this.resolveLimit(planLimit);
        if (currentRulesCount >= resolvedLimit) {
            throw new common_1.ForbiddenException(`Watch rules limit reached for the current subscription plan (${resolvedLimit})`);
        }
    }
};
exports.PlanLimitPolicy = PlanLimitPolicy;
exports.PlanLimitPolicy = PlanLimitPolicy = PlanLimitPolicy_1 = __decorate([
    (0, common_1.Injectable)()
], PlanLimitPolicy);
