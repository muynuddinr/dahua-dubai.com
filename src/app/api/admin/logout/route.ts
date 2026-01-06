import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Logged out' },
        { status: 200 }
      );
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return NextResponse.json(
        { message: 'Logged out' },
        { status: 200 }
      );
    }

    // Try to decode token to get email
    try {
      const decoded = jwt.verify(token, jwtSecret) as { email: string };
      
      // Deactivate the session in database
      await supabaseAdmin
        .from('admin_sessions')
        .update({ is_active: false })
        .eq('token', token);

    } catch (tokenError) {
      // Token might be invalid/expired, still consider logged out
    }

    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Logged out' },
      { status: 200 }
    );
  }
}
