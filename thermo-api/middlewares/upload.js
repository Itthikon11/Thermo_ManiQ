// ─────────────────────────────────────────────────────────────
// multer — รับอัปโหลดรูปภาพอย่างเดียว (≤ 8MB) เก็บลง server/uploads
//   ไฟล์ตั้งชื่อใหม่กันชนกัน:  <timestamp>-<random><ext>
// ─────────────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { APP_CONFIG } from '../configs/app.js';

// สร้างโฟลเดอร์ปลายทางถ้ายังไม่มี
fs.mkdirSync(APP_CONFIG.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, APP_CONFIG.uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: APP_CONFIG.uploadMaxBytes },
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('อัปโหลดได้เฉพาะไฟล์รูปภาพ'));
  },
});

// อัปโหลดไฟล์วิดีโอ (≤ 200MB) — ใช้ที่เส้นทางวิดีโอ
export const uploadVideo = multer({
  storage,
  limits: { fileSize: APP_CONFIG.uploadVideoMaxBytes },
  fileFilter: (_req, file, cb) => {
    if (/^video\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('อัปโหลดได้เฉพาะไฟล์วิดีโอ'));
  },
});
