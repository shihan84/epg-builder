import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { sourceChannelId, targetChannelId, scheduleIds, targetDate } = await request.json();

    if (!sourceChannelId || !targetChannelId || !scheduleIds || !targetDate) {
      return NextResponse.json(
        { error: 'Source channel, target channel, schedule IDs, and target date are required' },
        { status: 400 }
      );
    }

    if (sourceChannelId === targetChannelId) {
      return NextResponse.json(
        { error: 'Source and target channels cannot be the same' },
        { status: 400 }
      );
    }

    // Check if channels belong to user
    const [sourceChannel, targetChannel] = await Promise.all([
      db.channel.findFirst({ where: { id: sourceChannelId, userId } }),
      db.channel.findFirst({ where: { id: targetChannelId, userId } }),
    ]);

    if (!sourceChannel || !targetChannel) {
      return NextResponse.json(
        { error: 'One or both channels not found' },
        { status: 404 }
      );
    }

    // Get the schedules to copy
    const schedulesToCopy = await db.schedule.findMany({
      where: {
        id: { in: scheduleIds },
        userId,
        channelId: sourceChannelId,
      },
      include: {
        program: true,
      },
    });

    if (schedulesToCopy.length === 0) {
      return NextResponse.json(
        { error: 'No valid schedules found to copy' },
        { status: 404 }
      );
    }

    const targetDateObj = new Date(targetDate);
    const baseTime = new Date(targetDateObj);
    baseTime.setHours(0, 0, 0, 0); // Start of the target day

    // Create new schedules
    const newSchedules = await Promise.all(
      schedulesToCopy.map(async (schedule) => {
        const sourceStartTime = new Date(schedule.startTime);
        const sourceEndTime = new Date(schedule.endTime);
        
        // Calculate time offset from start of source day
        const sourceDayStart = new Date(sourceStartTime);
        sourceDayStart.setHours(0, 0, 0, 0);
        
        const timeOffset = sourceStartTime.getTime() - sourceDayStart.getTime();
        const duration = sourceEndTime.getTime() - sourceStartTime.getTime();

        // Apply to target date
        const newStartTime = new Date(baseTime.getTime() + timeOffset);
        const newEndTime = new Date(newStartTime.getTime() + duration);

        return db.schedule.create({
          data: {
            channelId: targetChannelId,
            programId: schedule.programId,
            startTime: newStartTime,
            endTime: newEndTime,
            isRecurring: schedule.isRecurring,
            recurringDays: schedule.recurringDays,
            notes: schedule.notes ? `Copied from ${sourceChannel.name}: ${schedule.notes}` : `Copied from ${sourceChannel.name}`,
            userId,
          },
        });
      })
    );

    return NextResponse.json({
      message: 'Schedules copied successfully',
      copiedCount: newSchedules.length,
      schedules: newSchedules,
    });
  } catch (error) {
    console.error('Copy schedules error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}