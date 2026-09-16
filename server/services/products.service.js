// ─────────────────────────────────────────────────────────────
// Product Service — logic ของสินค้า (validate / คำนวณ img / ลบไฟล์รูป)
// ─────────────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';
import { ProductModel } from '../models/index.js';
import { APP_CONFIG } from '../configs/app.js';
import { badRequest, notFound } from '../configs/http-error.js';

export const ProductService = {
  list: () => ProductModel.findAll(),

  create: async (body = {}, file) => {
    const { title, tagline = '', category = '' } = body;
    if (!title || !title.trim()) throw badRequest('กรุณากรอกชื่อสินค้า');

    // รูป: อัปโหลดไฟล์ → /uploads/... · ไม่งั้นใช้ข้อความ img ที่ส่งมา
    const img = file ? `/uploads/${file.filename}` : (body.img || '').trim();
    const sortOrder = await ProductModel.nextSortOrder();
    const id = await ProductModel.insert({
      title: title.trim(),
      tagline: tagline.trim(),
      category: category.trim(),
      img,
      sortOrder,
    });
    return ProductModel.findById(id);
  },

  update: async (id, body = {}, file) => {
    const existing = await ProductModel.findById(id);
    if (!existing) throw notFound('ไม่พบสินค้า');

    const { title, tagline = '', category = '' } = body;
    if (!title || !title.trim()) throw badRequest('กรุณากรอกชื่อสินค้า');

    // รูปใหม่ที่อัปโหลด → แทนที่ + ลบไฟล์เก่า · ไม่งั้นคงรูปเดิม
    let img = existing.img;
    if (file) {
      img = `/uploads/${file.filename}`;
      removeUploadedImage(existing.img);
    } else if (typeof body.img === 'string' && body.img.trim()) {
      img = body.img.trim();
    }

    await ProductModel.update(id, {
      title: title.trim(),
      tagline: tagline.trim(),
      category: category.trim(),
      img,
    });
    return ProductModel.findById(id);
  },

  remove: async (id) => {
    const row = await ProductModel.findById(id);
    await ProductModel.deleteById(id);
    removeUploadedImage(row?.img);
  },
};

// ลบไฟล์รูปที่เคยอัปโหลด (best-effort — เฉพาะไฟล์ใน /uploads/)
function removeUploadedImage(img = '') {
  if (img.startsWith('/uploads/')) {
    fs.promises.unlink(path.join(APP_CONFIG.uploadDir, path.basename(img))).catch(() => {});
  }
}
