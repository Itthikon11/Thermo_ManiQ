// ─────────────────────────────────────────────────────────────
// เส้นทางสินค้า — mount ที่ /api/products
//   GET /            สาธารณะ
//   POST /           ต้องล็อกอิน + แนบรูปได้ (field: image)
//   DELETE /:id      ต้องล็อกอิน
// ─────────────────────────────────────────────────────────────
import { Router } from 'express';
import { ProductController } from '../controllers/index.js';
import { requireAdmin, upload } from '../middlewares/index.js';

const router = Router();

router.get('/', ProductController.list);
router.post('/', requireAdmin, upload.single('image'), ProductController.create);
router.put('/:id', requireAdmin, upload.single('image'), ProductController.update);
router.delete('/:id', requireAdmin, ProductController.remove);

export default router;
