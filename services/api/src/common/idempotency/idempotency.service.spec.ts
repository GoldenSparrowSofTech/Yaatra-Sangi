import { describe, it, expect, beforeEach } from 'vitest';
import { IdempotencyService } from './idempotency.service.js';
import { ConflictException } from '@nestjs/common';

describe('IdempotencyService', () => {
  let service: IdempotencyService;

  beforeEach(() => {
    service = new IdempotencyService();
  });

  it('should allow first request and mark as processing', async () => {
    const cached = await service.startProcessing('key-123');
    expect(cached).toBeNull();
  });

  it('should throw ConflictException if request with same key is currently processing', async () => {
    await service.startProcessing('key-concurrent');
    await expect(service.startProcessing('key-concurrent')).rejects.toThrow(ConflictException);
  });

  it('should return cached response if request with same key has completed', async () => {
    await service.startProcessing('key-done');
    await service.markCompleted('key-done', { bookingId: 'b-999', status: 'HELD' });

    const cached = await service.startProcessing('key-done');
    expect(cached).toEqual({ bookingId: 'b-999', status: 'HELD' });
  });

  it('should allow retry if request failed', async () => {
    await service.startProcessing('key-failed');
    await service.markFailed('key-failed');

    const retry = await service.startProcessing('key-failed');
    expect(retry).toBeNull();
  });
});

