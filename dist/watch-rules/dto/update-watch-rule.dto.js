"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWatchRuleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_watch_rule_dto_1 = require("./create-watch-rule.dto");
class UpdateWatchRuleDto extends (0, swagger_1.PartialType)(create_watch_rule_dto_1.CreateWatchRuleDto) {
}
exports.UpdateWatchRuleDto = UpdateWatchRuleDto;
