// ─────────────────────────────────────────────────────────────
// Work Model — คุม SQL ของตาราง works ที่เดียว
// ─────────────────────────────────────────────────────────────
import { pool } from '../../configs/db.js';

export const WorkModel = {
  findAll: async () => {
    const [rows] = await pool.query('SELECT * FROM works ORDER BY sort_order ASC, id ASC');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM works WHERE id = ?', [id]);
    return rows[0] || null;
  },

  nextSortOrder: async () => {
    const [[{ mx }]] = await pool.query('SELECT COALESCE(MAX(sort_order), 0) AS mx FROM works');
    return mx + 1;
  },

  insert: async ({ title, img, sortOrder }) => {
    const [result] = await pool.query(
      'INSERT INTO works (title, img, sort_order) VALUES (?, ?, ?)',
      [title, img, sortOrder],
    );
    return result.insertId;
  },

  update: async (id, { title, img }) => {
    await pool.query('UPDATE works SET title = ?, img = ? WHERE id = ?', [title, img, id]);
  },

  deleteById: async (id) => {
    await pool.query('DELETE FROM works WHERE id = ?', [id]);
  },
};
