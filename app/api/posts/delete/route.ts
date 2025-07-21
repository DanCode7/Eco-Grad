import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { getUserFromEmail } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { userEmail, postId } = await request.json();

    if (!userEmail || !postId) {
      return NextResponse.json(
        { error: 'User email and post ID are required' },
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

    // 게시물 삭제
    await connection.execute(
      'DELETE FROM posts WHERE id = ? AND user_id = ?',
      [postId, user.id]
    );

    await connection.end();

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}