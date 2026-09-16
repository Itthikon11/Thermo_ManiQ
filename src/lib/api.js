// ─────────────────────────────────────────────────────────────
// ตัวช่วยเรียก Backend API — รวมไว้ที่เดียว
//   ฐาน URL อ่านจาก .env (VITE_API_BASE) ถ้าไม่ตั้งใช้ localhost:3001
//   backend อยู่ที่โฟลเดอร์ server/ (Express + MySQL)
// ─────────────────────────────────────────────────────────────
export const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3001';

// OAuth 2.0 Client ID สำหรับปุ่ม "เข้าสู่ระบบด้วย Google" (ตั้งใน .env: VITE_GOOGLE_CLIENT_ID)
//   ว่าง = ยังไม่ตั้งค่า → หน้า Login จะซ่อนปุ่ม Google
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

// แปลง path รูปให้เป็น URL ที่ใช้ได้จริง
//   /uploads/..  → รูปที่แอดมินอัปโหลด (เสิร์ฟจาก backend) → เติม API_BASE
//   /products/.. /works/.. → ไฟล์ใน public/ (เสิร์ฟจาก vite) → ใช้ตามเดิม
//   http(s)://.. → ใช้ตามเดิม
export function resolveImg(img) {
  if (!img) return '';
  if (/^https?:\/\//.test(img)) return img;
  if (img.startsWith('/uploads/')) return `${API_BASE}${img}`;
  return img;
}

// อ่าน token แอดมินจาก localStorage
function authHeader() {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ═══════════════════════ สถานะการเข้าสู่ระบบ ═══════════════════════
//   เก็บ token + role ลง localStorage · แจ้ง component อื่น (Navbar) ผ่าน event
export function getAuth() {
  try {
    return {
      token: localStorage.getItem('admin_token'),
      role: localStorage.getItem('admin_role'),
    };
  } catch {
    return { token: null, role: null };
  }
}

export function saveAuth(token, role = 'admin') {
  try {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_role', role);
  } catch {
    /* localStorage ใช้ไม่ได้ (โหมดส่วนตัว) — ข้าม */
  }
  window.dispatchEvent(new Event('auth-change'));
}

export function logout() {
  try {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_role');
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event('auth-change'));
}

// ตัวห่อ fetch: แปลง response เป็น JSON + โยน error พร้อมข้อความจาก backend
async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'เกิดข้อผิดพลาด');
  return data;
}

// ═══════════════════════ แอดมิน ═══════════════════════
/**
 * เข้าสู่ระบบแอดมิน
 * @returns {Promise<{ token: string, admin: object }>}
 */
export function loginAdmin({ username, password }) {
  return request('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
}

/**
 * เข้าสู่ระบบด้วย Google — ส่ง id_token (credential) จาก Google Identity Services
 * @returns {Promise<{ token: string, role: 'admin'|'user', admin: object }>}
 */
export function loginWithGoogle(credential) {
  return request('/api/admin/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
}

// ═══════════════════════ สินค้า ═══════════════════════
export function getProducts() {
  return request('/api/products');
}

/**
 * เพิ่มสินค้า — ส่งเป็น multipart/form-data (แนบไฟล์รูปได้)
 * @param {{ title, tagline, category, image?: File }} data
 */
export function createProduct({ title, tagline, category, image }) {
  const fd = new FormData();
  fd.append('title', title);
  fd.append('tagline', tagline ?? '');
  fd.append('category', category ?? '');
  if (image) fd.append('image', image);
  return request('/api/products', { method: 'POST', headers: authHeader(), body: fd });
}

/**
 * แก้ไขสินค้า — ส่งรูปใหม่ได้ (ไม่ส่ง = คงรูปเดิม)
 * @param {number} id
 * @param {{ title, tagline, category, image?: File }} data
 */
export function updateProduct(id, { title, tagline, category, image }) {
  const fd = new FormData();
  fd.append('title', title);
  fd.append('tagline', tagline ?? '');
  fd.append('category', category ?? '');
  if (image) fd.append('image', image);
  return request(`/api/products/${id}`, { method: 'PUT', headers: authHeader(), body: fd });
}

export function deleteProduct(id) {
  return request(`/api/products/${id}`, { method: 'DELETE', headers: authHeader() });
}

// ═══════════════════════ ผลงาน ═══════════════════════
export function getWorks() {
  return request('/api/works');
}

/**
 * เพิ่มผลงาน
 * @param {{ title, image?: File }} data
 */
export function createWork({ title, image }) {
  const fd = new FormData();
  fd.append('title', title);
  if (image) fd.append('image', image);
  return request('/api/works', { method: 'POST', headers: authHeader(), body: fd });
}

/**
 * แก้ไขผลงาน — ส่งรูปใหม่ได้ (ไม่ส่ง = คงรูปเดิม)
 * @param {number} id
 * @param {{ title, image?: File }} data
 */
export function updateWork(id, { title, image }) {
  const fd = new FormData();
  fd.append('title', title);
  if (image) fd.append('image', image);
  return request(`/api/works/${id}`, { method: 'PUT', headers: authHeader(), body: fd });
}

export function deleteWork(id) {
  return request(`/api/works/${id}`, { method: 'DELETE', headers: authHeader() });
}

// ═══════════════════════ วิดีโอ ═══════════════════════
//   เก็บเป็นลิงก์ (YouTube / ลิงก์ตรง) — ส่ง JSON ไม่ใช่ไฟล์
export function getVideos() {
  return request('/api/videos');
}

/**
 * เพิ่มวิดีโอ — ใส่ลิงก์ (url) หรือแนบไฟล์วิดีโอ (video) อย่างใดอย่างหนึ่ง
 * @param {{ title?: string, url?: string, video?: File }} data
 */
export function createVideo({ title, url, video }) {
  const fd = new FormData();
  fd.append('title', title ?? '');
  fd.append('url', url ?? '');
  if (video) fd.append('video', video);
  return request('/api/videos', { method: 'POST', headers: authHeader(), body: fd });
}

/**
 * แก้ไขวิดีโอ — แนบไฟล์ใหม่ได้ (ไม่แนบ = ใช้ลิงก์/ไฟล์เดิม)
 * @param {number} id
 * @param {{ title?: string, url?: string, video?: File }} data
 */
export function updateVideo(id, { title, url, video }) {
  const fd = new FormData();
  fd.append('title', title ?? '');
  fd.append('url', url ?? '');
  if (video) fd.append('video', video);
  return request(`/api/videos/${id}`, { method: 'PUT', headers: authHeader(), body: fd });
}

export function deleteVideo(id) {
  return request(`/api/videos/${id}`, { method: 'DELETE', headers: authHeader() });
}
