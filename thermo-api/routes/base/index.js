// กลุ่ม base — ข้อมูลหน้าเว็บ (สินค้า / ผลงาน / วิดีโอ)
import productRoutes from './products.route.js';
import workRoutes from './works.route.js';
import videoRoutes from './videos.route.js';

export default function baseRoutes(app) {
  app.use('/api/products', productRoutes);
  app.use('/api/works', workRoutes);
  app.use('/api/videos', videoRoutes);
}
