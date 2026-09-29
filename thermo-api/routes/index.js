// ─────────────────────────────────────────────────────────────
// barrel routes — รับ app แล้ว mount ทุกกลุ่ม (สไตล์ cctv: base / master-data)
// ─────────────────────────────────────────────────────────────
import baseRoutes from './base/index.js';
import masterDataRoutes from './master-data/index.js';

export default function mountRoutes(app) {
  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  baseRoutes(app);
  masterDataRoutes(app);
}
