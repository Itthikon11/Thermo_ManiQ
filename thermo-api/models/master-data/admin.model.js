// ─────────────────────────────────────────────────────────────
// Admin Model — คุม SQL ของตาราง admins ที่เดียว
// ─────────────────────────────────────────────────────────────
import { pool } from '../../configs/db.js';

export const AdminModel = {
  findByUsername: async (username) => {
    const [rows] = await pool.query('SELECT * FROM admins WHERE username = ? LIMIT 1', [username]);
    return rows[0] || null;
  },
};
