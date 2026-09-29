// ─────────────────────────────────────────────────────────────
// THERMO MANIQ · Backend API (Express + MySQL) — จุดบูตหลัก (บาง)
//   สถาปัตยกรรมแบบแบ่งชั้น: routes → controllers → services → models
//   รายละเอียดแต่ละส่วนแยกไฟล์:  configs/ · middlewares/ · routes/ ...
// ─────────────────────────────────────────────────────────────
import express from 'express';
import 'dotenv/config';

import { APP_CONFIG } from './configs/app.js';
import setupExpress from './configs/express.js';
import { assertDbConnection } from './configs/db.js';
import mountRoutes from './routes/index.js';
import { errorHandler } from './middlewares/index.js';
import { ensureDatabase, initDb } from './db/init.js';

const app = express();

setupExpress(app);   // cors · json · static /uploads
mountRoutes(app);    // /api/health · /api/admin · /api/products · /api/works
app.use(errorHandler); // ตัวดักจับ error รวม (ต่อท้ายสุด)

// ── บูตเซิร์ฟเวอร์ ────────────────────────────────────────────
(async () => {
  try {
    await ensureDatabase(); // สร้าง DB ถ้ายังไม่มี
    await assertDbConnection();
    console.log('🗄️  ต่อ MySQL สำเร็จ');
    await initDb();
    app.listen(APP_CONFIG.port, () => {
      console.log(`🚀 Backend พร้อมใช้งานที่ http://localhost:${APP_CONFIG.port}`);
      console.log(`   อนุญาต CORS: ${APP_CONFIG.corsOrigins.join(', ')}`);
    });
  } catch (err) {
    console.error('❌ เริ่มเซิร์ฟเวอร์ไม่ได้:', err.message);
    console.error('   ตรวจค่าใน thermo-api/.env (DB_USER / DB_PASSWORD / DB_NAME) และ MySQL ทำงานอยู่ไหม');
    process.exit(1);
  }
})();
