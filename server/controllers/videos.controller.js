// ─────────────────────────────────────────────────────────────
// Video Controller — บาง: รับ req → เรียก service → ตอบ res
// ─────────────────────────────────────────────────────────────
import { asyncHandler } from '../configs/async-handler.js';
import { VideoService } from '../services/index.js';

export const VideoController = {
  list: asyncHandler(async (_req, res) => {
    res.json(await VideoService.list());
  }),

  create: asyncHandler(async (req, res) => {
    const row = await VideoService.create(req.body, req.file);
    res.status(201).json(row);
  }),

  update: asyncHandler(async (req, res) => {
    const row = await VideoService.update(req.params.id, req.body, req.file);
    res.json(row);
  }),

  remove: asyncHandler(async (req, res) => {
    await VideoService.remove(req.params.id);
    res.json({ ok: true });
  }),
};
