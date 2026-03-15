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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWatchRuleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const notification_channel_enum_1 = require("../../common/constants/notification-channel.enum");
const trigger_type_enum_1 = require("../../common/constants/trigger-type.enum");
class CreateWatchRuleDto {
    productId;
    triggerType;
    channel;
    thresholdPrice;
    percentDrop;
    onlyOnce;
    cooldownHours;
    expiresAt;
    maxNotifications;
}
exports.CreateWatchRuleDto = CreateWatchRuleDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWatchRuleDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: trigger_type_enum_1.WatchTriggerType,
    }),
    (0, class_validator_1.IsEnum)(trigger_type_enum_1.WatchTriggerType),
    __metadata("design:type", String)
], CreateWatchRuleDto.prototype, "triggerType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: notification_channel_enum_1.NotificationChannel,
        default: notification_channel_enum_1.NotificationChannel.EMAIL,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notification_channel_enum_1.NotificationChannel),
    __metadata("design:type", String)
], CreateWatchRuleDto.prototype, "channel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateWatchRuleDto.prototype, "thresholdPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateWatchRuleDto.prototype, "percentDrop", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateWatchRuleDto.prototype, "onlyOnce", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateWatchRuleDto.prototype, "cooldownHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateWatchRuleDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateWatchRuleDto.prototype, "maxNotifications", void 0);
