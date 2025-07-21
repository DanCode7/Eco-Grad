import mysql from 'mysql2/promise';

export async function getConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'ecograd',
    password: process.env.DATABASE_PASSWORD || 'EcoGrad_1234',
    database: process.env.DATABASE_NAME || 'ecograd',
    ssl: process.env.DATABASE_HOST !== 'localhost' ? {
      rejectUnauthorized: true
    } : undefined
  });
  return connection;
}