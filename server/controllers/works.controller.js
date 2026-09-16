// ─────────────────────────────────────────────────────────────
// Work Controller — บาง: รับ req → เรียก service → ตอบ res
// ─────────────────────────────────────────────────────────────
import { asyncHandler } from '../configs/async-handler.js';
import { WorkService } from '../services/index.js';

export const WorkController = {
  list: asyncHandler(async (_req, res) => {
    res.json(await WorkService.list());
  }),

  create: asyncHandler(async (req, res) => {
    const row = await WorkService.create(req.body, req.file);
    res.status(201).json(row);
  }),

  update: asyncHandler(async (req, res) => {
    const row = await WorkService.update(req.params.id, req.body, req.file);
    res.json(row);
  }),

  remove: asyncHandler(async (req, res) => {
    await WorkService.remove(req.params.id);
    res.json({ ok: true });
  }),
};
