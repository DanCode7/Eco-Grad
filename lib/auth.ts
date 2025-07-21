import { getConnection } from './db';

export async function getUserFromEmail(email: string) {
  try {
    const connection = await getConnection();
    
    const [users] = await connection.execute(
      'SELECT id, username FROM users WHERE username = ?',
      [email]
    );
    
    await connection.end();
    
    if (Array.isArray(users) && users.length > 0) {
      return users[0] as { id: number; username: string };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}