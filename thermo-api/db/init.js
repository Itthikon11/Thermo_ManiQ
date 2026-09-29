// ─────────────────────────────────────────────────────────────
// ตั้งค่าฐานข้อมูลครั้งแรก — เรียกอัตโนมัติตอนบูต app.js
//   1) สร้างตาราง admins / products / works ถ้ายังไม่มี
//   2) เติมข้อมูลเริ่มต้น (seed) ถ้าตารางว่าง — ใช้ชุดเดิมที่เคย hardcode
//   3) สร้างบัญชีแอดมินเริ่มต้นจาก .env ถ้ายังไม่มีแอดมินสักคน
// รันเดี่ยว ๆ ก็ได้:  npm run init  (node db/init.js)
// ─────────────────────────────────────────────────────────────
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import { pool, buildSslOption } from '../configs/db.js';
import 'dotenv/config';

// ชุดสินค้าเริ่มต้น (ตรงกับที่เคยอยู่ใน src/pages/Products.jsx)
const SEED_PRODUCTS = [
  ['Growatt MIN', 'On Grid Inverter · 3–5kW · 1 Phase', 'On Grid', '/products/growatt-min-ongrid.jpg'],
  ['Growatt MOD', 'On Grid Inverter · 5–10kW · 3 Phase', 'On Grid', '/products/growatt-mod-ongrid.jpg'],
  ['Growatt MID 20kW', 'On Grid Inverter · 20kW · 3 Phase', 'On Grid', '/products/growatt-mid-20kw.jpg'],
  ['Growatt MID 40kW', 'On Grid Inverter · 40kW · 3 Phase', 'On Grid', '/products/growatt-mid-40kw.jpg'],
  ['Growatt MID 60kW', 'On Grid Inverter · 60kW · 3 Phase', 'On Grid', '/products/growatt-mid-60kw.jpg'],
  ['Growatt MID 80kW', 'On Grid Inverter · 80kW · 3 Phase', 'On Grid', '/products/growatt-mid-80kw.jpg'],
  ['Growatt MID 125kW', 'On Grid Inverter · 125kW · 3 Phase', 'On Grid', '/products/growatt-mid-125kw.jpg'],
  ['Growatt SP', 'Hybrid Inverter · 6–10kW · 1 Phase', 'Hybrid', '/products/growatt-sp-hybrid.jpg'],
  ['Growatt WIT', 'Hybrid Inverter · 10–15kW · 3 Phase', 'Hybrid', '/products/growatt-wit-hybrid.jpg'],
  ['Growatt SPF', 'Off Grid Inverter · 3–6kW · ใช้แบตเตอรี่ได้ทุกยี่ห้อ', 'Off Grid', '/products/growatt-spf-offgrid.jpg'],
  ['Growatt NEO', 'Micro Inverter · 2.5kW · 1 Phase', 'Micro', '/products/growatt-neo-micro.jpg'],
  ['HOPE Battery', 'แบตเตอรี่ลิเธียม · 5.0L / 16.0L', 'Battery', '/products/hope-battery.jpg'],
  ['Growatt Module', 'ShineMaster · WiFi · Smart Energy Manager', 'Module', '/products/growatt-module.jpg'],
];

// ชุดผลงานเริ่มต้น (ตรงกับที่เคยอยู่ใน src/pages/Works.jsx)
const SEED_WORKS = [
  ['บ้านดอนท้าว', '/works/work-05.jpg'],
  ['เทศบาลตำบลหัวทะเล', '/works/work-06.png'],
  ['บ้านท่ากระท่ม', '/works/work-07.png'],
  ['บ้านบะใหญ่', '/works/work-08.png'],
  ['บ้านบุกระโทก', '/works/work-09.png'],
  ['บ้านคุณทิ', '/works/work-10.jpg'],
  ['บ้านคุณพริษ', '/works/work-11.png'],
  ['บ้านคุณเท็น', '/works/work-12.png'],
  ['บ้านงิ้ว', '/works/work-13.jpg'],
  ['บ้าน ผอ.หมวย', '/works/work-14.png'],
  ['บ้านพระ', '/works/work-15.png'],
  ['บ้านพี่แม็ก', '/works/work-16.png'],
  ['บ้านพี่โจ้', '/works/work-17.png'],
  ['บ้านอาขวัญ', '/works/work-18.png'],
  ['บ้านเหล่า', '/works/work-19.png'],
  ['บ้านใหม่', '/works/work-20.png'],
  ['บ้านไพ', '/works/work-21.jpg'],
  ['บ้านปลายราง', '/works/work-22.png'],
  ['บ้านมะรุม', '/works/work-23.png'],
  ['โรงงานชนะชัยฯ', '/works/work-24.png'],
  ['บ้านระเริง', '/works/work-25.png'],
  ['บ้านลำนางแก้ว', '/works/work-26.png'],
  ['บ้านลุงเขว้า', '/works/work-27.png'],
  ['บ้านสุขัง', '/works/work-28.png'],
  ['บ้านหนองน้ำใส', '/works/work-29.jpg'],
  ['บ้านหนองพลอง', '/works/work-30.jpg'],
  ['บ้านหนองหัวแรด', '/works/work-31.png'],
  ['บ้านหลุมข้าว', '/works/work-32.jpg'],
  ['บ้านหัวทำนบ', '/works/work-33.jpg'],
  ['บ้านเขาฉกรรจ์', '/works/work-34.png'],
  ['บ้านเมืองเก่า', '/works/work-35.png'],
  ['บ้านเอื้อมน่าน', '/works/work-36.png'],
  ['บ้านโค้งยาง', '/works/work-37.png'],
  ['บ้านโตนด', '/works/work-38.png'],
  ['บ้านโนนสำราญ', '/works/work-39.png'],
];

// 0) สร้างฐานข้อมูลถ้ายังไม่มี — ต่อแบบไม่ระบุ database ก่อน (เครื่องใหม่ไม่ต้องสร้างเอง)
export async function ensureDatabase() {
  const name = process.env.DB_NAME || 'thermo_maniq';
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    ssl: buildSslOption(),
  });
  try {
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  } finally {
    await conn.end();
  }
}

export async function initDb() {
  // 1) สร้างตาราง ───────────────────────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      username     VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      title      VARCHAR(200) NOT NULL,
      tagline    VARCHAR(300) DEFAULT '',
      category   VARCHAR(100) DEFAULT '',
      img        VARCHAR(500) DEFAULT '',
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS works (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      title      VARCHAR(200) NOT NULL,
      img        VARCHAR(500) DEFAULT '',
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS videos (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      title      VARCHAR(200) DEFAULT '',
      url        VARCHAR(500) NOT NULL,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 2) seed ถ้าตารางว่าง ────────────────────────────────────────
  const [[{ pc }]] = await pool.query('SELECT COUNT(*) AS pc FROM products');
  if (pc === 0) {
    await pool.query(
      'INSERT INTO products (title, tagline, category, img, sort_order) VALUES ?',
      [SEED_PRODUCTS.map((r, i) => [...r, i])],
    );
    console.log(`  · seed products: ${SEED_PRODUCTS.length} รายการ`);
  }

  const [[{ wc }]] = await pool.query('SELECT COUNT(*) AS wc FROM works');
  if (wc === 0) {
    await pool.query(
      'INSERT INTO works (title, img, sort_order) VALUES ?',
      [SEED_WORKS.map((r, i) => [...r, i])],
    );
    console.log(`  · seed works: ${SEED_WORKS.length} รายการ`);
  }

  // 3) แอดมินเริ่มต้น ───────────────────────────────────────────
  const [[{ ac }]] = await pool.query('SELECT COUNT(*) AS ac FROM admins');
  if (ac === 0) {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'thermo123';
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO admins (username, password_hash) VALUES (?, ?)', [username, hash]);
    console.log(`  · สร้างแอดมินเริ่มต้น: ${username} / ${password}  (เปลี่ยนรหัสก่อนใช้จริง)`);
  }
}

// รันเดี่ยว ๆ: node init.js
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  ensureDatabase()
    .then(initDb)
    .then(() => {
      console.log('✅ init ฐานข้อมูลเรียบร้อย');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ init ล้มเหลว:', err.message);
      process.exit(1);
    });
}
