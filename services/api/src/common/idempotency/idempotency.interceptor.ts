import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { IdempotencyService } from './idempotency.service.js';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(private readonly idempotencyService: IdempotencyService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Only apply idempotency protection to state-changing requests
    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
      return next.handle();
    }

    const idempotencyKey =
      request.headers['idempotency-key'] || request.headers['x-idempotency-key'];

    if (!idempotencyKey || typeof idempotencyKey !== 'string') {
      return next.handle();
    }

    const cachedResponse = await this.idempotencyService.startProcessing(idempotencyKey);
    if (cachedResponse !== null) {
      return of(cachedResponse);
    }

    return next.handle().pipe(
      tap((data) => {
        this.idempotencyService.markCompleted(idempotencyKey, data);
      }),
      catchError((err) => {
        this.idempotencyService.markFailed(idempotencyKey);
        throw err;
      }),
    );
  }
}

