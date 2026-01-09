import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Verify JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (jwtError) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if session exists and is active in database
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('admin_sessions')
      .select('*')
      .eq('token', token)
      .eq('is_active', true)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { message: 'Session not found or expired' },
        { status: 401 }
      );
    }

    // Check if session has expired based on expires_at
    if (new Date(session.expires_at) < new Date()) {
      // Deactivate the expired session
      await supabaseAdmin
        .from('admin_sessions')
        .update({ is_active: false })
        .eq('id', session.id);

      return NextResponse.json(
        { message: 'Session expired' },
        { status: 401 }
      );
    }

    // Optional: Extend session on activity (sliding expiration)
    // This refreshes the session expiration each time the user is active
    const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    await supabaseAdmin
      .from('admin_sessions')
      .update({ 
        expires_at: newExpiresAt.toISOString()
      })
      .eq('id', session.id);

    return NextResponse.json(
      { 
        valid: true,
        user: { email: decoded.email, role: decoded.role }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    );
  }
}
