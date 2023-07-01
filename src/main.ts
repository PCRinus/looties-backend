import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const module: any;

const LOCAL_FRONTEND_URL = 'http://localhost:8000';
const DEV_FRONTEND_URL = 'https://looties-frontend-w3sd7.ondigitalocean.app/';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [LOCAL_FRONTEND_URL, DEV_FRONTEND_URL],
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('lootie-backend')
    .setDescription('lootie API for interacting with th client app')
    .setVersion('0.0.1')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
