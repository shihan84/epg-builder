import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, description, duration, category, genre, rating, imageUrl, isActive } = await request.json();

    // Check if program exists and belongs to user
    const existingProgram = await db.program.findFirst({
      where: { id: params.id, userId },
    });

    if (!existingProgram) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    const program = await db.program.update({
      where: { id: params.id },
      data: {
        title,
        description,
        duration: duration ? parseInt(duration) : undefined,
        category,
        genre,
        rating,
        imageUrl,
        isActive,
      },
    });

    return NextResponse.json({ program });
  } catch (error) {
    console.error('Update program error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if program exists and belongs to user
    const existingProgram = await db.program.findFirst({
      where: { id: params.id, userId },
    });

    if (!existingProgram) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    await db.program.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Delete program error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}