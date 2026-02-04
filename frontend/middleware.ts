import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isTokenValidOnServer } from './lib/server-jwt-utils';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;

  // Define public routes that don't require authentication
  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/register';

  // Define protected routes that require authentication
  const isProtectedRoute = pathname.startsWith('/tasks');

  // Check if user is authenticated by looking for access token in cookies or headers
  // Primary method: JWT token from either cookie or header (single source of truth)
  const tokenCookie = request.cookies.get('access_token')?.value;
  const authHeader = request.headers.get('authorization');
  const authToken = tokenCookie || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);

  // Validate JWT token expiration if present
  const isJwtTokenValid = authToken ? isTokenValidOnServer(authToken) : false;

  // For backward compatibility, we still check Better Auth session token
  // but prioritize JWT token as the primary auth method per target architecture
  const betterAuthSession = request.cookies.get('better-auth.session_token')?.value;

  // Prioritize JWT token as the primary authentication method
  // Only consider user authenticated if JWT token exists and is valid, or Better Auth session exists
  const isAuthenticated = (authToken && isJwtTokenValid) || !!betterAuthSession;

  // If accessing a protected route without authentication, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If authenticated user accesses login/register, redirect to tasks
  if ((pathname === '/login' || pathname === '/register') && isAuthenticated) {
    return NextResponse.redirect(new URL('/tasks', request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};