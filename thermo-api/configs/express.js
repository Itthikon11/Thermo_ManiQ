// ─────────────────────────────────────────────────────────────
// ตั้งค่า middleware กลางของ Express — เรียกครั้งเดียวจาก index.js
//   (เทียบ cctv-safety-api/configs/express.js: รวม cors + parser + static)
// ─────────────────────────────────────────────────────────────
import express from 'express';
import cors from 'cors';
import { APP_CONFIG } from './app.js';

export default function setupExpress(app) {
  // ── CORS: อนุญาตเฉพาะ origin ที่กำหนดใน .env ──────────────────
  app.use(
    cors({
      origin(origin, cb) {
        // ไม่มี origin (curl / same-origin) → ผ่าน
        if (!origin || APP_CONFIG.corsOrigins.includes(origin)) return cb(null, true);
        return cb(new Error(`CORS ไม่อนุญาต origin: ${origin}`));
      },
    }),
  );

  // ── JSON body parser ─────────────────────────────────────────
  app.use(express.json());

  // ── เสิร์ฟไฟล์รูปที่อัปโหลด ────────────────────────────────────
  app.use('/uploads', express.static(APP_CONFIG.uploadDir));
}
