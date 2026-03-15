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
exports.PriceChangedListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const event_names_1 = require("../../common/constants/event-names");
const price_changed_event_1 = require("../../pricing/events/price-changed.event");
const notifications_service_1 = require("../notifications.service");
let PriceChangedListener = class PriceChangedListener {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    handlePriceChanged(event) {
        if (event.matchedRules.length === 0) {
            return;
        }
        return this.notificationsService.createRuleNotifications(event);
    }
};
exports.PriceChangedListener = PriceChangedListener;
__decorate([
    (0, event_emitter_1.OnEvent)(event_names_1.EVENT_NAMES.PRICE_CHANGED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [price_changed_event_1.PriceChangedEvent]),
    __metadata("design:returntype", void 0)
], PriceChangedListener.prototype, "handlePriceChanged", null);
exports.PriceChangedListener = PriceChangedListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], PriceChangedListener);
