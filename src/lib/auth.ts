import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from './supabase';

interface AdminUser {
  email: string;
  role: string;
}

interface VerifyResult {
  success: boolean;
  user?: AdminUser;
  error?: string;
  status?: number;
}

/**
 * Verify admin JWT token and check session validity
 * Use this in all admin API routes
 */
export async function verifyAdmin(request: NextRequest): Promise<VerifyResult> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        error: 'No token provided',
        status: 401,
      };
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return {
        success: false,
        error: 'Server configuration error',
        status: 500,
      };
    }

    // Verify JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (jwtError) {
      return {
        success: false,
        error: 'Invalid or expired token',
        status: 401,
      };
    }

    // Check if session exists and is active in database
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('admin_sessions')
      .select('*')
      .eq('token', token)
      .eq('is_active', true)
      .single();

    if (sessionError || !session) {
      return {
        success: false,
        error: 'Session not found or expired',
        status: 401,
      };
    }

    // Check if session has expired
    if (new Date(session.expires_at) < new Date()) {
      // Deactivate the expired session
      await supabaseAdmin
        .from('admin_sessions')
        .update({ is_active: false })
        .eq('id', session.id);

      return {
        success: false,
        error: 'Session expired',
        status: 401,
      };
    }

    return {
      success: true,
      user: {
        email: decoded.email,
        role: decoded.role,
      },
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return {
      success: false,
      error: 'Authentication failed',
      status: 500,
    };
  }
}

/**
 * Create unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized') {
  return NextResponse.json({ success: false, message }, { status: 401 });
}

/**
 * Create error response
 */
export function errorResponse(message: string, status: number = 500) {
  return NextResponse.json({ success: false, message }, { status });
}

/**
 * Create success response
 */
export function successResponse(data: any, status: number = 200) {
  return NextResponse.json({ success: true, ...data }, { status });
}
