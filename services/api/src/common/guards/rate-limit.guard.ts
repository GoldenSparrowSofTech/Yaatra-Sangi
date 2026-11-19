import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const RATE_LIMIT_KEY = 'rate_limit';
export interface RateLimitOptions {
  limit: number;
  ttlSeconds: number;
}

export const Throttle = (limit: number, ttlSeconds = 60) =>
  SetMetadata(RATE_LIMIT_KEY, { limit, ttlSeconds });

interface ClientRecord {
  timestamps: number[];
}

/**
 * SEC-04: Lightweight zero-dependency in-memory sliding-window rate limiter
 * Protects authentication and public enquiry endpoints from abuse.
 */
@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly store = new Map<string, ClientRecord>();

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const config = this.reflector.getAllAndOverride<RateLimitOptions>(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no explicit throttle metadata, allow request
    if (!config) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    // Resolve client IP safely (prefer direct connection IP over unverified headers)
    const clientIp =
      req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown-client';
    const key = `${clientIp}:${context.getClass().name}:${context.getHandler().name}`;

    const now = Date.now();
    const windowStart = now - config.ttlSeconds * 1000;

    let record = this.store.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.store.set(key, record);
    }

    // Filter out expired timestamps
    record.timestamps = record.timestamps.filter((t) => t > windowStart);

    if (record.timestamps.length >= config.limit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Too many requests. Rate limit of ${config.limit} requests per ${config.ttlSeconds}s exceeded.`,
          error: 'Too Many Requests',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    record.timestamps.push(now);
    return true;
  }
}
