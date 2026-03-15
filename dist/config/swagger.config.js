"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSwagger = configureSwagger;
const swagger_1 = require("@nestjs/swagger");
function configureSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('PriceWatcher API')
        .setDescription('API for price monitoring and rule-based notifications')
        .setVersion('1.0.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    }, 'bearer')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
}
