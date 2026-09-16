// ─────────────────────────────────────────────────────────────
// barrel routes — รับ app แล้ว mount ทุกกลุ่ม (สไตล์ cctv)
// ─────────────────────────────────────────────────────────────
import adminRoutes from './admin.route.js';
import productRoutes from './products.route.js';
import workRoutes from './works.route.js';
import videoRoutes from './videos.route.js';

export default function mountRoutes(app) {
  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  app.use('/api/admin', adminRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/works', workRoutes);
  app.use('/api/videos', videoRoutes);
}
