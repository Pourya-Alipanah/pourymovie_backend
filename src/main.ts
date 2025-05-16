import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';

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
   * Enable CORS for all routes
   */
  app.enableCors();

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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
