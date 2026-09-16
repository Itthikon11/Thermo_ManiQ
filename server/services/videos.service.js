// ─────────────────────────────────────────────────────────────
// Video Service — logic ของวิดีโอ
//   แหล่งวิดีโอได้ 2 แบบ: ลิงก์ (YouTube / ลิงก์ตรง) หรือ อัปโหลดไฟล์
//   ถ้าอัปโหลดไฟล์ → เก็บเป็น /uploads/.. และลบไฟล์เก่าตอนแก้ไข/ลบ
// ─────────────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';
import { VideoModel } from '../models/index.js';
import { APP_CONFIG } from '../configs/app.js';
import { badRequest, notFound } from '../configs/http-error.js';

export const VideoService = {
  list: () => VideoModel.findAll(),

  create: async (body = {}, file) => {
    const url = file ? `/uploads/${file.filename}` : (body.url || '').trim();
    if (!url) throw badRequest('กรุณากรอกลิงก์วิดีโอ หรือเลือกไฟล์วิดีโอ');

    const sortOrder = await VideoModel.nextSortOrder();
    const id = await VideoModel.insert({ title: (body.title || '').trim(), url, sortOrder });
    return VideoModel.findById(id);
  },

  update: async (id, body = {}, file) => {
    const existing = await VideoModel.findById(id);
    if (!existing) throw notFound('ไม่พบวิดีโอ');

    let url = existing.url;
    if (file) {
      url = `/uploads/${file.filename}`;
      removeUploadedFile(existing.url);
    } else if (typeof body.url === 'string' && body.url.trim()) {
      url = body.url.trim();
    }
    if (!url) throw badRequest('กรุณากรอกลิงก์วิดีโอ หรือเลือกไฟล์วิดีโอ');

    await VideoModel.update(id, { title: (body.title || '').trim(), url });
    return VideoModel.findById(id);
  },

  remove: async (id) => {
    const row = await VideoModel.findById(id);
    await VideoModel.deleteById(id);
    removeUploadedFile(row?.url);
  },
};

// ลบไฟล์วิดีโอที่อัปโหลดไว้ (เฉพาะที่อยู่ใน /uploads/ — ไม่แตะลิงก์ภายนอก)
function removeUploadedFile(url = '') {
  if (url.startsWith('/uploads/')) {
    fs.promises.unlink(path.join(APP_CONFIG.uploadDir, path.basename(url))).catch(() => {});
  }
}
