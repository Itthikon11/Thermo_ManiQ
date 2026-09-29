// ─────────────────────────────────────────────────────────────
// เส้นทางผลงาน — mount ที่ /api/works
// ─────────────────────────────────────────────────────────────
import { Router } from 'express';
import { WorkController } from '../../controllers/index.js';
import { requireAdmin, upload } from '../../middlewares/index.js';

const router = Router();

router.get('/', WorkController.list);
router.post('/', requireAdmin, upload.single('image'), WorkController.create);
router.put('/:id', requireAdmin, upload.single('image'), WorkController.update);
router.delete('/:id', requireAdmin, WorkController.remove);

export default router;
