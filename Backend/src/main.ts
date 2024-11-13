import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',  // Frontend URL
    credentials: true,                // Allow credentials (cookies)
    allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly allow necessary headers
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow these methods
  });
  app.use(cookieParser()); // Use cookie-parser middleware
  await app.listen(3001);
}
bootstrap();
