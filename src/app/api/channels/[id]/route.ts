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

    const { name, description, language, category, streamUrl, isActive } = await request.json();

    // Check if channel exists and belongs to user
    const existingChannel = await db.channel.findFirst({
      where: { id: params.id, userId },
    });

    if (!existingChannel) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      );
    }

    const channel = await db.channel.update({
      where: { id: params.id },
      data: {
        name,
        description,
        language,
        category,
        streamUrl,
        isActive,
      },
    });

    return NextResponse.json({ channel });
  } catch (error) {
    console.error('Update channel error:', error);
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

    // Check if channel exists and belongs to user
    const existingChannel = await db.channel.findFirst({
      where: { id: params.id, userId },
    });

    if (!existingChannel) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      );
    }

    await db.channel.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Channel deleted successfully' });
  } catch (error) {
    console.error('Delete channel error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}