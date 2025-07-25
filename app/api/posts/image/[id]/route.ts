import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await getConnection();

    // 특정 게시물의 이미지만 조회
    const [rows] = await connection.execute(
      'SELECT image_url FROM posts WHERE id = ?',
      [params.id]
    );

    await connection.end();

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { image_url: rows[0].image_url },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}