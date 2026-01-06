import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminEmail || !adminPassword || !jwtSecret) {
      console.error('Missing environment variables');
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Validate credentials
    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token (24 hours expiry)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const token = jwt.sign(
      { email, role: 'admin' },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Get client info for session tracking
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Deactivate any existing sessions for this admin
    await supabaseAdmin
      .from('admin_sessions')
      .update({ is_active: false })
      .eq('email', email)
      .eq('is_active', true);

    // Save new session to database
    const { error: sessionError } = await supabaseAdmin
      .from('admin_sessions')
      .insert([{
        email,
        token,
        ip_address: ipAddress,
        user_agent: userAgent,
        is_active: true,
        expires_at: expiresAt.toISOString()
      }]);

    if (sessionError) {
      console.error('Failed to save session:', sessionError);
      // Continue with login even if session save fails
    }

    return NextResponse.json(
      { 
        message: 'Login successful',
        token,
        user: { email, role: 'admin' }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
