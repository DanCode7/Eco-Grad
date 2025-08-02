import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();

    // Create users table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create posts table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(50) NOT NULL,
        item_type ENUM('Gown', 'Cap', 'Stole', 'Set') NOT NULL,
        size ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL') NOT NULL,
        condition_status ENUM('New', 'Like New', 'Worn') NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        contact_info TEXT NOT NULL,
        image_path VARCHAR(500),
        image_filename VARCHAR(255),
        image_url VARCHAR(500),
        status ENUM('active', 'sold') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_status (status),
        INDEX idx_user_id (user_id),
        INDEX idx_item_type (item_type),
        INDEX idx_size (size),
        INDEX idx_condition (condition_status),
        INDEX idx_price (price)
      )
    `);

    // Create messages table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        post_id INT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        INDEX idx_sender_id (sender_id),
        INDEX idx_receiver_id (receiver_id),
        INDEX idx_post_id (post_id),
        INDEX idx_is_read (is_read),
        INDEX idx_created_at (created_at)
      )
    `);

    await connection.end();

    return NextResponse.json(
      { message: 'Database initialized successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}