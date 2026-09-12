import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // cors -> browsers security rule
  // Nest backend: I accept browser requests from localhost:5173."
  app.enableCors({
    origin: 'http://localhost:5173',
  });

  // Apply validation to all incoming requests in backend
  // Use validation decorators from our DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove fields not defined in DTO
      forbidNonWhitelisted: true, // reject requests with extra fields not defined in DTO
      transform: true, // transform incoming requet data into the expected DTO types where appropriate
    }),
  );

  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
// Enable NestJS validation globally with ValidationPipe

