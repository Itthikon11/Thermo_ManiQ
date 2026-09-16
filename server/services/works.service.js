// ─────────────────────────────────────────────────────────────
// Work Service — logic ของผลงาน (validate / คำนวณ img / ลบไฟล์รูป)
// ─────────────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';
import { WorkModel } from '../models/index.js';
import { APP_CONFIG } from '../configs/app.js';
import { badRequest, notFound } from '../configs/http-error.js';

export const WorkService = {
  list: () => WorkModel.findAll(),

  create: async (body = {}, file) => {
    const { title } = body;
    if (!title || !title.trim()) throw badRequest('กรุณากรอกชื่อผลงาน');

    const img = file ? `/uploads/${file.filename}` : (body.img || '').trim();
    const sortOrder = await WorkModel.nextSortOrder();
    const id = await WorkModel.insert({ title: title.trim(), img, sortOrder });
    return WorkModel.findById(id);
  },

  update: async (id, body = {}, file) => {
    const existing = await WorkModel.findById(id);
    if (!existing) throw notFound('ไม่พบผลงาน');

    const { title } = body;
    if (!title || !title.trim()) throw badRequest('กรุณากรอกชื่อผลงาน');

    let img = existing.img;
    if (file) {
      img = `/uploads/${file.filename}`;
      removeUploadedImage(existing.img);
    } else if (typeof body.img === 'string' && body.img.trim()) {
      img = body.img.trim();
    }

    await WorkModel.update(id, { title: title.trim(), img });
    return WorkModel.findById(id);
  },

  remove: async (id) => {
    const row = await WorkModel.findById(id);
    await WorkModel.deleteById(id);
    removeUploadedImage(row?.img);
  },
};

function removeUploadedImage(img = '') {
  if (img.startsWith('/uploads/')) {
    fs.promises.unlink(path.join(APP_CONFIG.uploadDir, path.basename(img))).catch(() => {});
  }
}
