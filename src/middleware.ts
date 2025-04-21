import type { MiddlewareHandler } from 'astro';
// Fix the import path - make sure jwt.js exists at this location
import { verifyToken } from './lib/auth/jwt.js';

export const onRequest: MiddlewareHandler = async ({ request, locals, redirect }, next) => {
  // Get the cookies from the request
  const cookies = request.headers.get('cookie') || '';
  const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('auth_token='));
  
  if (tokenCookie) {
    const token = tokenCookie.split('=')[1];
    try {
      const user = verifyToken(token);
      
      if (user) {
        locals.user = user;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      // Continue without setting user if token is invalid
    }
  }
  
  // Protected routes logic
  const url = new URL(request.url);
  
  // Redirect authenticated users away from login/register pages
  if ((url.pathname === '/login' || url.pathname === '/register') && locals.user) {
    return redirect('/dashboard');
  }
  
  // Protected routes that require authentication
  if (url.pathname.startsWith('/dashboard') && !locals.user) {
    return redirect('/login');
  }
  
  // Important: Call next() to continue processing the request if no redirects happened
  return next();
};