/**
 * Secure JWT Configuration Helper
 * SEC-03: Fails application startup in production if JWT_SECRET is not configured.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET environment variable is missing in production environment');
    }
    return 'dev-insecure-jwt-secret-do-not-use-in-production';
  }
  return secret;
}
