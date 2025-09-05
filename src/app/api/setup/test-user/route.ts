import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    console.log('Test user creation request received');
    
    const { email, password, name, company } = await request.json();

    console.log('Test user data:', { email, name, company, hasPassword: !!password });

    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Create fresh Prisma client instance for this request
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL!,
        },
      },
    });

    try {
      // Test database connection
      console.log('Testing database connection...');
      await prisma.$queryRaw`SELECT 1`;
      console.log('Database connection successful');

      // Check if user already exists
      console.log('Checking for existing user...');
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log('User already exists:', email);
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }

      // Hash password
      console.log('Hashing password...');
      const hashedPassword = await bcrypt.hash(password, 12);
      console.log('Password hashed successfully');

      // Create user
      console.log('Creating user...');
      const user = await prisma.user.create({
        data: {
          id: crypto.randomUUID(),
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
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error',
          suggestion: 'Please check your DATABASE_URL environment variable and ensure database tables exist'
        },
        { status: 503 }
      );
    } finally {
      await prisma.$disconnect();
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