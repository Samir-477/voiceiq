import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This proxy runs on every request.
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Get the authentication token from cookies
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';

  // 2. Define protected routes (everything except login, api, and public assets)
  const isLoginPage = pathname.startsWith('/login');
  const isPublicAsset = 
    pathname.startsWith('/_next') || 
    pathname.includes('.') || 
    pathname.startsWith('/api/');

  // 3. Routing Logic
  
  // Case A: Not authenticated and trying to access a protected page (including /)
  if (!isAuthenticated && !isLoginPage && !isPublicAsset) {
    const loginUrl = new URL('/login', request.url);
    // Optionally preserve the original destination to redirect back after login
    // loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Case B: Authenticated and trying to access the login page
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Case C: Allow all other requests (public assets, API calls, or already authenticated)
  return NextResponse.next();
}

// Optionally, specify exactly which paths the middleware should run on
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
