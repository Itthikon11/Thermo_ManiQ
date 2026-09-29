// ─────────────────────────────────────────────────────────────
// ตรวจ JWT ของแอดมิน — ใส่คั่นหน้า route ที่ต้องล็อกอินก่อน
//   ต้องส่งหัว  Authorization: Bearer <token>
// ─────────────────────────────────────────────────────────────
import jwt from 'jsonwebtoken';
import { APP_CONFIG } from '../configs/app.js';

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'กรุณาเข้าสู่ระบบก่อน' });
  }

  try {
    const decoded = jwt.verify(token, APP_CONFIG.jwtSecret);
    // token รุ่นเก่าไม่มี role → ถือเป็น admin (เข้ากันได้ย้อนหลัง)
    //   role 'user' (Google ทั่วไป) → เข้าแผงแอดมินไม่ได้
    if (decoded.role && decoded.role !== 'admin') {
      return res.status(403).json({ message: 'บัญชีนี้ไม่มีสิทธิ์เข้าถึงส่วนผู้ดูแล' });
    }
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่' });
  }
}
