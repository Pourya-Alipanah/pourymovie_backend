import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';


/**
 * bootstrap
 * @description This function is responsible for bootstrapping the application.
 * It creates the application and sets up the global configuration.
 * It also sets up the Swagger documentation and enables CORS.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Use validation pipes globally
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  /**
   * swagger configuration
   */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('PouryMovie Api')
    .setDescription('Use the base API URL as http://localhost:1406/api/v1')
    .setVersion('1.0')
    .addServer('http://localhost:1406/api/v1')
    .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'access-token',
  )
    .build();

  // Instantiate Document
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/apiDocs', app, document);

  /**
   * Enable CORS for all routes
   */
  app.enableCors();

  /**
   * set global prefix
   */
  app.setGlobalPrefix('api');

  /**
   * enable versioning
   */
  app.enableVersioning({
    type: VersioningType.URI,
  });

  /**
   * enable helmet
   */
  app.use(helmet());

  /**
   * enable cookie parser
   */
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
