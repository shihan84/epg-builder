import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('Test user creation request received');
    
    // This is a one-time setup endpoint - in production, you'd want to protect this
    const { email, password, name, company } = await request.json();

    console.log('Test user data:', { email, name, company, hasPassword: !!password });

    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    try {
      console.log('Checking for existing user...');
      const existingUser = await db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log('User already exists:', email);
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
    } catch (dbError) {
      console.error('Database query error (existing user check):', dbError);
      return NextResponse.json(
        { error: 'Database connection failed while checking existing user' },
        { status: 503 }
      );
    }

    // Hash password
    try {
      console.log('Hashing password...');
      const hashedPassword = await bcrypt.hash(password, 12);
      console.log('Password hashed successfully');

      // Create user
      console.log('Creating user...');
      const user = await db.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          company,
        },
      });
      
      console.log('Test user created successfully:', user.id);

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json({
        user: userWithoutPassword,
        message: 'Test user created successfully',
      });
    } catch (createError) {
      console.error('Test user creation error:', createError);
      
      // Provide more specific error messages
      if (createError instanceof Error) {
        if (createError.message.includes('Unique constraint')) {
          return NextResponse.json(
            { error: 'User with this email already exists' },
            { status: 409 }
          );
        }
        
        if (createError.message.includes('connection') || createError.message.includes('database')) {
          return NextResponse.json(
            { error: 'Database connection failed. Please try again later.' },
            { status: 503 }
          );
        }
      }
      
      return NextResponse.json(
        { error: 'Failed to create test user. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Create test user error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}