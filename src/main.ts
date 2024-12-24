import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');

  app.enableCors({
    origin: ['http://auth.localhost:3001', 'http://platform.localhost:3002'],
    credentials: true,
  });
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('SEA Platform Microservice')
    .setDescription('API Docs of the SEA Platform Microservice application')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Strip properties that do not have decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are found
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
