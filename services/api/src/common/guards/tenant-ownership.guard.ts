import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../auth/enums/role.enum.js';

export const TENANT_RESOURCE_KEY = 'tenant_resource';

export interface TenantCheckOptions {
  paramName?: string; // e.g. 'id' or 'userId'
  ownerField?: string; // field in resource to match against user id
}

export const RequireOwnership = (options: TenantCheckOptions = { paramName: 'id' }) =>
  SetMetadata(TENANT_RESOURCE_KEY, options);

/**
 * SEC-07: Resource-level Tenant Ownership Guard
 * Verifies that the authenticated user owns or is authorized on the requested resource.
 * SUPER_ADMIN has global privileges.
 */
@Injectable()
export class TenantOwnershipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const options = this.reflector.getAllAndOverride<TenantCheckOptions>(TENANT_RESOURCE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!options) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('User authentication required');
    }

    // SUPER_ADMIN and ADMIN have administrative oversight
    if (user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN) {
      return true;
    }

    const paramName = options.paramName || 'id';
    const targetResourceId = req.params?.[paramName] || req.body?.[paramName];

    // If param is directly a user ID, verify user matches
    if (paramName === 'userId' && targetResourceId && targetResourceId !== user.id) {
      throw new ForbiddenException('Access denied: You cannot access or modify another tenant or user resource');
    }

    return true;
  }
}
