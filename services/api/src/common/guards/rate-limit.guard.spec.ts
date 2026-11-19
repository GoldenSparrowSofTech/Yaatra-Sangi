import { describe, it, expect, beforeEach } from 'vitest';
import { Reflector } from '@nestjs/core';
import { RateLimitGuard, RATE_LIMIT_KEY } from './rate-limit.guard.js';

describe('RateLimitGuard', () => {
  let guard: RateLimitGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RateLimitGuard(reflector);
  });

  const createMockContext = (ip = '127.0.0.1') => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          ip,
          connection: { remoteAddress: ip },
        }),
      }),
      getHandler: () => ({}),
      getClass: () => ({ name: 'TestController' }),
    } as any;
  };

  it('should allow request when no rate limit metadata is present', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const context = createMockContext();
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow requests within configured limit', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue({ limit: 3, ttlSeconds: 60 });
    const context = createMockContext();

    expect(guard.canActivate(context)).toBe(true);
    expect(guard.canActivate(context)).toBe(true);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw 429 when rate limit is exceeded', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue({ limit: 2, ttlSeconds: 60 });
    const context = createMockContext('192.168.1.100');

    expect(guard.canActivate(context)).toBe(true);
    expect(guard.canActivate(context)).toBe(true);
    expect(() => guard.canActivate(context)).toThrow('Too many requests');
  });
});
