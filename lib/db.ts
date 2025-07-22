import mysql from 'mysql2/promise';

export async function getConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'ecograd',
    password: 'EcoGrad_1234',
    database: 'ecograd'
  });
  return connection;
}