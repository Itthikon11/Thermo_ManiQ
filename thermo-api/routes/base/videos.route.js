// ─────────────────────────────────────────────────────────────
// เส้นทางวิดีโอ — mount ที่ /api/videos
//   เก็บเป็นลิงก์ (JSON body) ไม่มีอัปโหลดไฟล์
// ─────────────────────────────────────────────────────────────
import { Router } from 'express';
import { VideoController } from '../../controllers/index.js';
import { requireAdmin, uploadVideo } from '../../middlewares/index.js';

const router = Router();

router.get('/', VideoController.list);
router.post('/', requireAdmin, uploadVideo.single('video'), VideoController.create);
router.put('/:id', requireAdmin, uploadVideo.single('video'), VideoController.update);
router.delete('/:id', requireAdmin, VideoController.remove);

export default router;
