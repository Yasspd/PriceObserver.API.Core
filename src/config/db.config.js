"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
const config_1 = require("@nestjs/config");
const DEFAULT_DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/price_watcher?schema=public';
exports.dbConfig = (0, config_1.registerAs)('db', () => ({
    url: process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL,
}));
