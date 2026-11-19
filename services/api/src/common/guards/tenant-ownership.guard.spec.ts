import { describe, it, expect, beforeEach } from 'vitest';
import { Reflector } from '@nestjs/core';
import { TenantOwnershipGuard, TENANT_RESOURCE_KEY } from './tenant-ownership.guard.js';
import { Role } from '../../auth/enums/role.enum.js';
import { ForbiddenException } from '@nestjs/common';

describe('TenantOwnershipGuard', () => {
  let guard: TenantOwnershipGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new TenantOwnershipGuard(reflector);
  });

  const createMockContext = (user: any, params: any = {}) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user,
          params,
        }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as any;
  };

  it('should allow request when no ownership metadata is present', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const context = createMockContext({ id: 'user-1' });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException when user is unauthenticated', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue({ paramName: 'userId' });
    const context = createMockContext(null);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should allow access if user is SUPER_ADMIN', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue({ paramName: 'userId' });
    const context = createMockContext({ id: 'admin-1', role: Role.SUPER_ADMIN }, { userId: 'other-user' });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access if user ID matches requested resource user ID', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue({ paramName: 'userId' });
    const context = createMockContext({ id: 'user-123', role: Role.HOTEL_OWNER }, { userId: 'user-123' });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access if user is ADMIN', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue({ paramName: 'userId' });
    const context = createMockContext({ id: 'admin-2', role: Role.ADMIN }, { userId: 'managed-tenant' });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should block IDOR attempt when user ID does not match resource owner', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue({ paramName: 'userId' });
    const context = createMockContext({ id: 'attacker-1', role: Role.HOTEL_OWNER }, { userId: 'victim-2' });
    expect(() => guard.canActivate(context)).toThrow('Access denied');
  });

  it('should block IDOR attempt when staff member attempts to access another tenant resource', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue({ paramName: 'userId' });
    const context = createMockContext({ id: 'staff-1', role: Role.HOTEL_STAFF }, { userId: 'other-hotel-owner' });
    expect(() => guard.canActivate(context)).toThrow('Access denied');
  });
});
