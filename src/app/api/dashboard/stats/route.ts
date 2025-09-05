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

    // Get user's statistics
    const [totalChannels, totalPrograms, totalSchedules, activeTemplates] = await Promise.all([
      db.channel.count({
        where: { userId, isActive: true },
      }),
      db.program.count({
        where: { userId, isActive: true },
      }),
      db.schedule.count({
        where: { userId },
      }),
      db.template.count({
        where: { userId },
      }),
    ]);

    return NextResponse.json({
      totalChannels,
      totalPrograms,
      totalSchedules,
      activeTemplates,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}