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

    const { sourceChannelId, targetChannelId, programIds } = await request.json();

    if (!sourceChannelId || !targetChannelId || !programIds) {
      return NextResponse.json(
        { error: 'Source channel, target channel, and program IDs are required' },
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

    // Get the programs to copy
    const programsToCopy = await db.program.findMany({
      where: {
        id: { in: programIds },
        userId,
      },
    });

    if (programsToCopy.length === 0) {
      return NextResponse.json(
        { error: 'No valid programs found to copy' },
        { status: 404 }
      );
    }

    // Check for duplicate program titles in target channel
    const targetChannelPrograms = await db.program.findMany({
      where: {
        userId,
        channelId: targetChannelId,
      },
      select: {
        title: true,
      },
    });

    const targetProgramTitles = new Set(targetChannelPrograms.map(p => p.title.toLowerCase()));

    // Create new programs with modified titles if duplicates exist
    const newPrograms = await Promise.all(
      programsToCopy.map(async (program) => {
        let newTitle = program.title;
        let counter = 1;

        // If title already exists, add a suffix
        while (targetProgramTitles.has(newTitle.toLowerCase())) {
          newTitle = `${program.title} (Copy ${counter})`;
          counter++;
        }

        return db.program.create({
          data: {
            title: newTitle,
            description: program.description,
            duration: program.duration,
            category: program.category,
            genre: program.genre,
            rating: program.rating,
            imageUrl: program.imageUrl,
            isActive: program.isActive,
            userId,
          },
        });
      })
    );

    return NextResponse.json({
      message: 'Programs copied successfully',
      copiedCount: newPrograms.length,
      programs: newPrograms,
    });
  } catch (error) {
    console.error('Copy programs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}