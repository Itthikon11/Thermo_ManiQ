// ─────────────────────────────────────────────────────────────
// ค่าตั้งรวมของแอป — อ่านจาก .env ที่เดียว แล้วให้ไฟล์อื่น import ใช้
//   (เทียบ cctv-safety-api/configs/app.js แต่ครบกว่า: cors / upload)
// ─────────────────────────────────────────────────────────────
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const APP_CONFIG = {
  port: Number(process.env.PORT) || 3001,

  // JWT
  jwtSecret: process.env.JWT_SECRET,
  jwtExpires: process.env.JWT_EXPIRES || '7d',

  // เข้าสู่ระบบด้วย Google (Google Identity Services)
  //   googleClientId  — OAuth 2.0 Client ID (ต้องตรงกับฝั่ง frontend)
  //   allowedGoogleEmails — อีเมลที่อนุญาตให้เข้า (คั่น ,) · '*' = อนุญาตทุกคน
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  allowedGoogleEmails: (process.env.ALLOWED_GOOGLE_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),

  // CORS: อนุญาตเฉพาะ origin ของ frontend (คั่นด้วย comma)
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5180')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  // อัปโหลดรูป — เก็บที่ server/uploads (configs อยู่ลึกลงมา 1 ชั้น)
  uploadDir: path.join(__dirname, '..', 'uploads'),
  uploadMaxBytes: 8 * 1024 * 1024, // 8MB (รูปภาพ)
  uploadVideoMaxBytes: 200 * 1024 * 1024, // 200MB (วิดีโอ)
};
