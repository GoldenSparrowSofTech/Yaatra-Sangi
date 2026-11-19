import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // SEC-06: Baseline HTTP Security Headers
  app.use((req: any, res: any, next: () => void) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // SEC-05: Environment-aware CORS configuration with explicit allow-list
  const rawOrigins = process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000';
  const allowedOrigins = rawOrigins.split(',').map((o) => o.trim()).filter(Boolean);

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow non-browser requests (mobile apps, curl, server-to-server) with no origin
      if (!origin) {
        return callback(null, true);
      }
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
}

await bootstrap();
