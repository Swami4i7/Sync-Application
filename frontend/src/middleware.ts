import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/login', '/auth/error', '/api/auth'];
  const protectedRoutes = ['/schedule-details', '/setup-details', '/schedule-logs', '/users'];
  const adminRoutes = ['/admin'];

  console.log('Middleware triggered for path:', pathname);

  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));
 
  const token = await getToken({
    req: request,
    secret: process.env.JWT_SECRET, 
    cookieName: 'next-auth.session-token', 
  });

  if (token && pathname === '/login') {
    console.log('Redirecting authenticated user from login to setup-details');
    return NextResponse.redirect(new URL('/setup-details', request.url));
  }

  if (isPublicRoute) {
    console.log('Allowing public route:', pathname);
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  console.log('Token:', token ? 'Present' : 'Not present');

  const isProtectedRoute = protectedRoutes.some(route => pathname === route || pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname === route || pathname.startsWith(route));

  if (!token) {
    if (isProtectedRoute || isAdminRoute) {
      console.log('Redirecting unauthenticated user from:', pathname);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    console.log('Allowing non-protected route for unauthenticated user:', pathname);
    return NextResponse.next();
  }

  if(token && pathname === '/') {
    console.log('Redirecting authenticated user to the home page', pathname);
    return NextResponse.redirect(new URL('/setup-details', request.url));
  }

  const userRole = token.role ;
  console.log('User role:', userRole);

  if (isAdminRoute && userRole !== 'admin') {
    console.log('Redirecting non-admin user from admin route:', pathname);
    return NextResponse.redirect(new URL('/403', request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', token.id as string);
  requestHeaders.set('x-user-role', userRole);
  requestHeaders.set('x-user-username', token.username);

  console.log('Allowing authenticated user to:', pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth/signout).*)', 
  ],
};
