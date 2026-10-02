import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware — runs server-side before page loads.
 * Protects /profile/* and /checkout routes by checking for the auth token cookie.
 * Unauthenticated visitors are redirected to /auth/login with a redirect param.
 */

const protectedPaths = ['/profile', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected route
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for auth token in cookie (synced from localStorage on login)
  const token = request.cookies.get('token')?.value;

  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    // Keep URL clean without ?redirect=...
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set('redirect_after_login', pathname, {
      path: '/',
      maxAge: 600, // 10 minutes
      sameSite: 'lax',
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/admin/:path*'],
};
