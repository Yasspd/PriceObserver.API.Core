"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const event_emitter_1 = require("@nestjs/event-emitter");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const auth_module_1 = require("./auth/auth.module");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const throttler_guard_1 = require("./common/guards/throttler.guard");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const timeout_interceptor_1 = require("./common/interceptors/timeout.interceptor");
const app_config_1 = require("./config/app.config");
const auth_config_1 = require("./config/auth.config");
const db_config_1 = require("./config/db.config");
const env_validation_1 = require("./config/env.validation");
const redis_config_1 = require("./config/redis.config");
const health_module_1 = require("./health/health.module");
const monitoring_module_1 = require("./monitoring/monitoring.module");
const notifications_module_1 = require("./notifications/notifications.module");
const plans_module_1 = require("./plans/plans.module");
const pricing_module_1 = require("./pricing/pricing.module");
const prisma_module_1 = require("./prisma/prisma.module");
const products_module_1 = require("./products/products.module");
const queue_module_1 = require("./queue/queue.module");
const redis_module_1 = require("./redis/redis.module");
const users_module_1 = require("./users/users.module");
const watch_rules_module_1 = require("./watch-rules/watch-rules.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                load: [app_config_1.appConfig, auth_config_1.authConfig, db_config_1.dbConfig, redis_config_1.redisConfig],
                validate: env_validation_1.validateEnvironment,
            }),
            event_emitter_1.EventEmitterModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60_000, limit: 30 }]),
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
            queue_module_1.QueueModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            products_module_1.ProductsModule,
            watch_rules_module_1.WatchRulesModule,
            pricing_module_1.PricingModule,
            monitoring_module_1.MonitoringModule,
            notifications_module_1.NotificationsModule,
            plans_module_1.PlansModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_guard_1.AppThrottlerGuard,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: global_exception_filter_1.GlobalExceptionFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: timeout_interceptor_1.TimeoutInterceptor,
            },
        ],
    })
], AppModule);
