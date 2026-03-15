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
exports.WatchRulesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const create_watch_rule_dto_1 = require("./dto/create-watch-rule.dto");
const query_watch_rules_dto_1 = require("./dto/query-watch-rules.dto");
const update_watch_rule_dto_1 = require("./dto/update-watch-rule.dto");
const watch_rules_service_1 = require("./watch-rules.service");
let WatchRulesController = class WatchRulesController {
    watchRulesService;
    constructor(watchRulesService) {
        this.watchRulesService = watchRulesService;
    }
    createWatchRule(user, dto) {
        return this.watchRulesService.create(user.userId, dto);
    }
    getWatchRules(user, query) {
        return this.watchRulesService.findAll(user.userId, query);
    }
    getWatchRule(user, watchRuleId) {
        return this.watchRulesService.findById(user.userId, watchRuleId);
    }
    updateWatchRule(user, watchRuleId, dto) {
        return this.watchRulesService.update(user.userId, watchRuleId, dto);
    }
};
exports.WatchRulesController = WatchRulesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a watch rule for a product' }),
    (0, swagger_1.ApiCreatedResponse)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_watch_rule_dto_1.CreateWatchRuleDto]),
    __metadata("design:returntype", void 0)
], WatchRulesController.prototype, "createWatchRule", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List current user watch rules' }),
    (0, swagger_1.ApiOkResponse)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_watch_rules_dto_1.QueryWatchRulesDto]),
    __metadata("design:returntype", void 0)
], WatchRulesController.prototype, "getWatchRules", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single watch rule' }),
    (0, swagger_1.ApiOkResponse)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WatchRulesController.prototype, "getWatchRule", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a watch rule' }),
    (0, swagger_1.ApiOkResponse)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_watch_rule_dto_1.UpdateWatchRuleDto]),
    __metadata("design:returntype", void 0)
], WatchRulesController.prototype, "updateWatchRule", null);
exports.WatchRulesController = WatchRulesController = __decorate([
    (0, swagger_1.ApiTags)('watch-rules'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('watch-rules'),
    __metadata("design:paramtypes", [watch_rules_service_1.WatchRulesService])
], WatchRulesController);
