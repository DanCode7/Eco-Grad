import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const item_type = formData.get('item_type') as string;
    const size = formData.get('size') as string;
    const condition_status = formData.get('condition_status') as string;
    const price = parseFloat(formData.get('price') as string);
    const contact_info = formData.get('contact_info') as string;
    const user_id = parseInt(formData.get('user_id') as string);
    const imageFile = formData.get('image') as File;

    let image_url = null;

    // 이미지 파일 저장
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // 고유한 파일명 생성
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${imageFile.name}`;
      const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
      
      await writeFile(filepath, buffer);
      image_url = `/uploads/${filename}`;
    }

    const connection = await getConnection();

    const [result] = await connection.execute(
      `INSERT INTO posts (
        user_id, 
        title, 
        item_type, 
        size, 
        condition_status, 
        price, 
        contact_info,
        image_url,
        status,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
      [
        user_id,
        title,
        item_type,
        size,
        condition_status,
        price,
        contact_info,
        image_url
      ]
    );

    await connection.end();

    return NextResponse.json(
      { 
        message: 'Post created successfully',
        postId: result.insertId
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