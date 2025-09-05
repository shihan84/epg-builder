import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Test basic database connection
    await db.$queryRaw`SELECT 1`;
    
    // Check if tables exist
    const tables = await db.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `;
    
    // Check users table specifically
    const userCount = await db.user.count();
    
    return NextResponse.json({
      message: 'Database connection successful',
      tables: tables,
      userCount: userCount,
      databaseInfo: {
        provider: 'postgresql',
        connected: true
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      suggestion: 'Please check your DATABASE_URL environment variable and ensure database tables exist'
    }, { status: 503 });
  }
}