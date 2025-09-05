import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Check if database is available
    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email with error handling
    let user;
    try {
      user = await db.user.findUnique({
        where: { email },
      });
    } catch (dbError) {
      console.error('Database query error:', dbError);
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 503 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session token (simple implementation for demo)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      user: userWithoutPassword,
      token,
    });

    // Set HTTP-only cookie for session
    response.cookies.set('session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle database connection errors specifically
    if (error instanceof Error && (
      error.message.includes('database') || 
      error.message.includes('Prisma') ||
      error.message.includes('connection')
    )) {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}