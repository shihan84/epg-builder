import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const schedules = await db.schedule.findMany({
      where: { userId },
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
      orderBy: { startTime: 'desc' },
    });

    return NextResponse.json({ schedules });
  } catch (error) {
    console.error('Get schedules error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { channelId, programId, startTime, endTime, isRecurring, recurringDays, notes } = await request.json();

    if (!channelId || !programId || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Channel, program, start time, and end time are required' },
        { status: 400 }
      );
    }

    const schedule = await db.schedule.create({
      data: {
        channelId,
        programId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        isRecurring: isRecurring || false,
        recurringDays,
        notes,
        userId,
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
    console.error('Create schedule error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}