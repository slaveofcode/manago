import { defineMiddleware } from 'astro:middleware';
import { verifyToken } from './lib/auth/jwt';

export const onRequest = defineMiddleware(async ({ request, locals, cookies }, next) => {
  // Get the auth token from cookies
  const token = cookies.get('auth_token')?.value;
  
  // If there's a token, verify it and set the user in locals
  if (token) {
    try {
      const user = await verifyToken(token);
      if (user) {
        locals.user = user;
      }
    } catch (error) {
      // Token is invalid, clear it
      cookies.delete('auth_token', { path: '/' });
    }
  }
  
  // Continue to the next middleware or route handler
  return next();
});