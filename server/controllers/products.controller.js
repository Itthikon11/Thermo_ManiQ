// ─────────────────────────────────────────────────────────────
// Product Controller — บาง: รับ req → เรียก service → ตอบ res
//   คงทรง response เดิม (array / row / {ok:true}) ให้ frontend อ่านได้
// ─────────────────────────────────────────────────────────────
import { asyncHandler } from '../configs/async-handler.js';
import { ProductService } from '../services/index.js';

export const ProductController = {
  list: asyncHandler(async (_req, res) => {
    res.json(await ProductService.list());
  }),

  create: asyncHandler(async (req, res) => {
    const row = await ProductService.create(req.body, req.file);
    res.status(201).json(row);
  }),

  update: asyncHandler(async (req, res) => {
    const row = await ProductService.update(req.params.id, req.body, req.file);
    res.json(row);
  }),

  remove: asyncHandler(async (req, res) => {
    await ProductService.remove(req.params.id);
    res.json({ ok: true });
  }),
};
