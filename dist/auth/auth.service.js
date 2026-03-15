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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const plan_enum_1 = require("../common/constants/plan.enum");
const hash_util_1 = require("../common/utils/hash.util");
const plans_repository_1 = require("../plans/plans.repository");
const auth_repository_1 = require("./auth.repository");
let AuthService = class AuthService {
    authRepository;
    plansRepository;
    jwtService;
    configService;
    constructor(authRepository, plansRepository, jwtService, configService) {
        this.authRepository = authRepository;
        this.plansRepository = plansRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async signUp(dto) {
        const existingUser = await this.authRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const defaultPlan = await this.plansRepository.findOrCreateDefaultPlan(plan_enum_1.SubscriptionPlanCode.FREE);
        const user = await this.authRepository.createUser({
            email: dto.email,
            passwordHash: await (0, hash_util_1.hashValue)(dto.password),
            firstName: dto.firstName,
            lastName: dto.lastName,
            subscriptionPlan: defaultPlan
                ? {
                    connect: {
                        id: defaultPlan.id,
                    },
                }
                : undefined,
        });
        return this.buildAuthResponse(user);
    }
    async signIn(dto) {
        const user = await this.authRepository.findByEmail(dto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await (0, hash_util_1.compareHash)(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.buildAuthResponse(user);
    }
    async refreshToken(dto) {
        try {
            const payload = await this.jwtService.verifyAsync(dto.refreshToken, {
                secret: this.configService.get('auth.jwtRefreshSecret') ??
                    'change-me-refresh-secret',
            });
            const user = await this.authRepository.findById(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            return this.buildAuthResponse(user);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async buildAuthResponse(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            subscriptionPlanCode: user.subscriptionPlan?.code ?? null,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('auth.jwtSecret') ??
                    'change-me-access-secret',
                expiresIn: this.configService.get('auth.accessTokenTtlSeconds') ?? 3600,
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('auth.jwtRefreshSecret') ??
                    'change-me-refresh-secret',
                expiresIn: this.configService.get('auth.refreshTokenTtlSeconds') ??
                    604800,
            }),
        ]);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                subscriptionPlan: user.subscriptionPlan?.code ?? null,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_repository_1.AuthRepository,
        plans_repository_1.PlansRepository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
