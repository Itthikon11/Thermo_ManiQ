// ─────────────────────────────────────────────────────────────
// ตัวดักจับ error รวม — ต่อท้ายสุดหลัง mount routes
//   ใช้ err.status ถ้ามี (จาก HttpError) · CORS → 403 · อื่น ๆ → 400
//   ตอบทรงเดิม { message } เพื่อให้ frontend (src/lib/api.js) อ่านได้
// ─────────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  console.error('API error:', err.message);
  const status = err.status || (err.message?.startsWith('CORS') ? 403 : 400);
  res.status(status).json({ message: err.message || 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' });
}
