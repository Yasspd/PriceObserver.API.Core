"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchRulesModule = void 0;
const common_1 = require("@nestjs/common");
const products_module_1 = require("../products/products.module");
const users_module_1 = require("../users/users.module");
const cooldown_policy_1 = require("./policies/cooldown.policy");
const expiration_policy_1 = require("./policies/expiration.policy");
const plan_limit_policy_1 = require("./policies/plan-limit.policy");
const watch_rules_controller_1 = require("./watch-rules.controller");
const watch_rules_repository_1 = require("./watch-rules.repository");
const watch_rules_service_1 = require("./watch-rules.service");
let WatchRulesModule = class WatchRulesModule {
};
exports.WatchRulesModule = WatchRulesModule;
exports.WatchRulesModule = WatchRulesModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, products_module_1.ProductsModule],
        controllers: [watch_rules_controller_1.WatchRulesController],
        providers: [
            watch_rules_service_1.WatchRulesService,
            watch_rules_repository_1.WatchRulesRepository,
            plan_limit_policy_1.PlanLimitPolicy,
            expiration_policy_1.ExpirationPolicy,
            cooldown_policy_1.CooldownPolicy,
        ],
        exports: [
            watch_rules_service_1.WatchRulesService,
            watch_rules_repository_1.WatchRulesRepository,
            plan_limit_policy_1.PlanLimitPolicy,
            expiration_policy_1.ExpirationPolicy,
            cooldown_policy_1.CooldownPolicy,
        ],
    })
], WatchRulesModule);
