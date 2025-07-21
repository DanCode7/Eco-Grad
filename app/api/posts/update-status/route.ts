import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { getUserFromEmail } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { userEmail, postId, status } = await request.json();

    if (!userEmail || !postId || !status) {
      return NextResponse.json(
        { error: 'User email, post ID, and status are required' },
        { status: 400 }
      );
    }

    if (!['active', 'sold'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either "active" or "sold"' },
        { status: 400 }
      );
    }

    // 사용자 정보 조회
    const user = await getUserFromEmail(userEmail);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const connection = await getConnection();

    // 게시물이 해당 사용자의 것인지 확인
    const [posts] = await connection.execute(
      'SELECT id FROM posts WHERE id = ? AND user_id = ?',
      [postId, user.id]
    );

    if (!Array.isArray(posts) || posts.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Post not found or not authorized' },
        { status: 404 }
      );
    }

    // 게시물 상태 업데이트
    await connection.execute(
      'UPDATE posts SET status = ? WHERE id = ? AND user_id = ?',
      [status, postId, user.id]
    );

    await connection.end();

    return NextResponse.json(
      { 
        message: 'Post status updated successfully',
        newStatus: status
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating post status:', error);
    return NextResponse.json(
      { error: 'Failed to update post status' },
      { status: 500 }
    );
  }
}