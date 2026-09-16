// ─────────────────────────────────────────────────────────────
// การเชื่อมต่อ MySQL — connection pool (mysql2/promise)
//   อ่านค่าจาก .env · export pool ให้ models เรียก query ได้เลย
// ─────────────────────────────────────────────────────────────
import mysql from 'mysql2/promise';
import 'dotenv/config';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'thermo_maniq',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
});

// ทดสอบว่าต่อ DB ได้ไหม — เรียกตอนบูตเซิร์ฟเวอร์
export async function assertDbConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.query('SELECT 1');
  } finally {
    conn.release();
  }
}
