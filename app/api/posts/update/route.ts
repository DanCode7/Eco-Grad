import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { getUserFromEmail } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { 
      userEmail, 
      postId,
      title, 
      item_type, 
      size, 
      condition_status, 
      price, 
      contact_info,
      image_url
    } = await request.json();

    // 필수 필드 검증
    if (!userEmail || !postId || !title || !item_type || !size || !condition_status || !price || !contact_info) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // 가격 검증
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      return NextResponse.json(
        { error: 'Invalid price' },
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

    // 게시물 업데이트
    await connection.execute(
      `UPDATE posts 
      SET title = ?, item_type = ?, size = ?, condition_status = ?, price = ?, contact_info = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?`,
      [title, item_type, size, condition_status, numPrice, contact_info, image_url, postId, user.id]
    );

    await connection.end();

    return NextResponse.json(
      { message: 'Post updated successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}