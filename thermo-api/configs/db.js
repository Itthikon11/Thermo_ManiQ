// ─────────────────────────────────────────────────────────────
// การเชื่อมต่อ MySQL — connection pool (mysql2/promise)
//   อ่านค่าจาก .env · export pool ให้ models เรียก query ได้เลย
// ─────────────────────────────────────────────────────────────
import mysql from 'mysql2/promise';
import 'dotenv/config';

// SSL — MySQL บนคลาวด์ (Aiven / TiDB / Railway ...) มักบังคับ TLS
//   ตั้ง DB_SSL=true เพื่อเปิด · DB_SSL_CA = เนื้อ CA cert (ถ้าเจ้านั้นให้มา)
//   DB_SSL_REJECT_UNAUTHORIZED=false = ข้ามการตรวจใบรับรอง (เลี่ยงถ้าไม่จำเป็น)
export function buildSslOption() {
  if (String(process.env.DB_SSL).toLowerCase() !== 'true') return undefined;
  const ssl = { minVersion: 'TLSv1.2' };
  if (process.env.DB_SSL_CA) ssl.ca = process.env.DB_SSL_CA.replace(/\\n/g, '\n');
  if (String(process.env.DB_SSL_REJECT_UNAUTHORIZED).toLowerCase() === 'false') {
    ssl.rejectUnauthorized = false;
  }
  return ssl;
}

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'thermo_maniq',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  ssl: buildSslOption(),
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
