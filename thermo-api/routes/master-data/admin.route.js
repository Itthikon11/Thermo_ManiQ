// ─────────────────────────────────────────────────────────────
// เส้นทางแอดมิน — mount ที่ /api/admin
//   POST /login → รับ token
// ─────────────────────────────────────────────────────────────
import { Router } from 'express';
import { AdminController } from '../../controllers/index.js';

const router = Router();

router.post('/login', AdminController.login);
router.post('/google', AdminController.google);

export default router;
