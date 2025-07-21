import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { getUserFromEmail } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { 
      userEmail, 
      title, 
      item_type, 
      size, 
      condition_status, 
      price, 
      contact_info,
      image_path,
      image_filename,
      image_url
    } = await request.json();

    // 필수 필드 검증
    if (!userEmail || !title || !item_type || !size || !condition_status || !price || !contact_info) {
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

    // 새 게시물 생성
    const [result] = await connection.execute(
      `INSERT INTO posts 
        (user_id, title, item_type, size, condition_status, price, contact_info, image_path, image_filename, image_url, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [user.id, title, item_type, size, condition_status, numPrice, contact_info, image_path, image_filename, image_url]
    );

    await connection.end();

    return NextResponse.json(
      { 
        message: 'Post created successfully',
        postId: (result as any).insertId
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}