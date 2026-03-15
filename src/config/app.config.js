"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const config_1 = require("@nestjs/config");
exports.appConfig = (0, config_1.registerAs)('app', () => ({
    port: Number.parseInt(process.env.PORT ?? '3000', 10),
    globalPrefix: process.env.API_PREFIX ?? 'api',
    appName: process.env.APP_NAME ?? 'PriceWatcher API',
}));
