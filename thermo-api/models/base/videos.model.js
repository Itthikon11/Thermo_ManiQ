// ─────────────────────────────────────────────────────────────
// Video Model — คุม SQL ของตาราง videos ที่เดียว
// ─────────────────────────────────────────────────────────────
import { pool } from '../../configs/db.js';

export const VideoModel = {
  findAll: async () => {
    const [rows] = await pool.query('SELECT * FROM videos ORDER BY sort_order ASC, id ASC');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM videos WHERE id = ?', [id]);
    return rows[0] || null;
  },

  nextSortOrder: async () => {
    const [[{ mx }]] = await pool.query('SELECT COALESCE(MAX(sort_order), 0) AS mx FROM videos');
    return mx + 1;
  },

  insert: async ({ title, url, sortOrder }) => {
    const [result] = await pool.query(
      'INSERT INTO videos (title, url, sort_order) VALUES (?, ?, ?)',
      [title, url, sortOrder],
    );
    return result.insertId;
  },

  update: async (id, { title, url }) => {
    await pool.query('UPDATE videos SET title = ?, url = ? WHERE id = ?', [title, url, id]);
  },

  deleteById: async (id) => {
    await pool.query('DELETE FROM videos WHERE id = ?', [id]);
  },
};
