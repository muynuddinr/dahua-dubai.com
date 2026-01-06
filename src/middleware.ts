import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Auth is handled via JWT in API routes (src/lib/auth.ts)
  // Admin pages check auth client-side via AdminLayoutWrapper
  return NextResponse.next();
}

// Middleware only runs on admin routes for future enhancements
export const config = {
  matcher: ['/admin/:path*'],
};
