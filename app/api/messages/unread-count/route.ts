import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    const [result] = await connection.execute(
      `SELECT COUNT(*) as unread_count 
       FROM messages 
       WHERE receiver_id = ? AND is_read = FALSE`,
      [userId]
    );

    await connection.end();

    const unreadCount = (result as any)[0].unread_count;

    return NextResponse.json({ unreadCount }, { status: 200 });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unread count' },
      { status: 500 }
    );
  }
}