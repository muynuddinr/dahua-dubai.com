import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect /admin and /dashboard routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('admin_token')?.value;

    // Check if token exists
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verify token validity
    const payload = verifyToken(token);
    if (!payload) {
      // Redirect to login if token is invalid/expired
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to protect
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
