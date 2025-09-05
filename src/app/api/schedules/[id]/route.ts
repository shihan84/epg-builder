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

    const { channelId, programId, startTime, endTime, isRecurring, recurringDays, notes } = await request.json();

    // Check if schedule exists and belongs to user
    const existingSchedule = await db.schedule.findFirst({
      where: { id: params.id, userId },
    });

    if (!existingSchedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    const schedule = await db.schedule.update({
      where: { id: params.id },
      data: {
        channelId,
        programId,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        isRecurring,
        recurringDays,
        notes,
      },
      include: {
        channel: {
          select: {
            id: true,
            name: true,
            language: true,
          },
        },
        program: {
          select: {
            id: true,
            title: true,
            duration: true,
            category: true,
          },
        },
      },
    });

    return NextResponse.json({ schedule });
  } catch (error) {
    console.error('Update schedule error:', error);
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

    // Check if schedule exists and belongs to user
    const existingSchedule = await db.schedule.findFirst({
      where: { id: params.id, userId },
    });

    if (!existingSchedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    await db.schedule.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}