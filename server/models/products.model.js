// ─────────────────────────────────────────────────────────────
// Product Model — คุม SQL ของตาราง products ที่เดียว
//   ใช้ prepared statement (?) กัน SQL injection
// ─────────────────────────────────────────────────────────────
import { pool } from '../configs/db.js';

export const ProductModel = {
  findAll: async () => {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY sort_order ASC, id ASC');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0] || null;
  },

  nextSortOrder: async () => {
    const [[{ mx }]] = await pool.query('SELECT COALESCE(MAX(sort_order), 0) AS mx FROM products');
    return mx + 1;
  },

  insert: async ({ title, tagline, category, img, sortOrder }) => {
    const [result] = await pool.query(
      'INSERT INTO products (title, tagline, category, img, sort_order) VALUES (?, ?, ?, ?, ?)',
      [title, tagline, category, img, sortOrder],
    );
    return result.insertId;
  },

  update: async (id, { title, tagline, category, img }) => {
    await pool.query(
      'UPDATE products SET title = ?, tagline = ?, category = ?, img = ? WHERE id = ?',
      [title, tagline, category, img, id],
    );
  },

  deleteById: async (id) => {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
  },
};
