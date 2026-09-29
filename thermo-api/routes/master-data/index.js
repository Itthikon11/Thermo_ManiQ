// กลุ่ม master-data — ผู้ดูแลระบบ
import adminRoutes from './admin.route.js';

export default function masterDataRoutes(app) {
  app.use('/api/admin', adminRoutes);
}
