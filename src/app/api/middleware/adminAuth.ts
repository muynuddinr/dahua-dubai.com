import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

/**
 * Middleware to verify admin authentication on protected routes
 * Checks for valid JWT token in cookies
 * Returns 401 if token is missing or invalid
 */
export function checkAdminAuth(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    return {
      isValid: false,
      error: NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      ),
    };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return {
      isValid: false,
      error: NextResponse.json(
        { error: 'Unauthorized - Invalid or expired token' },
        { status: 401 }
      ),
    };
  }

  return {
    isValid: true,
    payload,
  };
}

/**
 * Middleware to verify public API authentication
 * Used for public endpoints that require basic authentication
 */
export function checkPublicAuth(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    return {
      isValid: false,
      error: NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      ),
    };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return {
      isValid: false,
      error: NextResponse.json(
        { error: 'Unauthorized - Invalid or expired token' },
        { status: 401 }
      ),
    };
  }

  return {
    isValid: true,
    payload,
  };
}
