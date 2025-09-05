import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('session-token')?.value;

  // If no token, redirect to login (only for protected routes)
  if (!token) {
    // Allow access to public routes without authentication
    const publicPaths = ['/login', '/register', '/setup'];
    const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
    
    if (isPublicPath) {
      return NextResponse.next();
    }
    
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify token (simple implementation for demo)
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');

    if (!userId) {
      throw new Error('Invalid token');
    }

    // Check if user exists (with error handling)
    let user;
    try {
      user = await db.user.findUnique({
        where: { id: userId },
      });
    } catch (dbError) {
      console.error('Database error in middleware:', dbError);
      // If database is not available, allow the request to proceed
      // This prevents the app from breaking during database issues
      return NextResponse.next();
    }

    if (!user) {
      throw new Error('User not found');
    }

    // Add user info to headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('user-id', userId);
    requestHeaders.set('user-email', user.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Authentication error:', error);
    
    // For API routes, return 401 instead of redirect
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/((?!login|register|setup|api/auth|api/setup|_next/static|_next/image|favicon.ico).*)',
  ],
};