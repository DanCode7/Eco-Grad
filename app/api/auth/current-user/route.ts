import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    const [users] = await connection.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    await connection.end();

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userId = (users[0] as any).id;

    return NextResponse.json({ userId }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user ID' },
      { status: 500 }
    );
  }
}