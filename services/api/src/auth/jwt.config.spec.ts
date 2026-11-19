import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getJwtSecret } from './jwt.config.js';

describe('getJwtSecret (SEC-03)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return configured JWT_SECRET when present', () => {
    process.env.JWT_SECRET = 'a_very_strong_custom_secret_key_123';
    expect(getJwtSecret()).toBe('a_very_strong_custom_secret_key_123');
  });

  it('should throw fatal error in production when JWT_SECRET is missing', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.JWT_SECRET;
    expect(() => getJwtSecret()).toThrow('FATAL: JWT_SECRET environment variable is missing');
  });

  it('should return safe development fallback when not in production', () => {
    process.env.NODE_ENV = 'development';
    delete process.env.JWT_SECRET;
    expect(getJwtSecret()).toContain('dev-insecure-jwt-secret');
  });
});
