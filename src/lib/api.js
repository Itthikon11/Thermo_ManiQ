// ─────────────────────────────────────────────────────────────
// ตัวช่วยเรียก Backend API — รวมไว้ที่เดียว
//   ฐาน URL อ่านจาก .env (VITE_API_BASE) ถ้าไม่ตั้งใช้ localhost:3001
//   ตอนนี้ backend ยังไม่เปิด → loginAdmin จะโยน error ให้หน้า Login โชว์
// ─────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3001';

/**
 * เข้าสู่ระบบแอดมิน
 * @param {{ username: string, password: string }} cred
 * @returns {Promise<{ token: string, admin: object }>}
 */
export async function loginAdmin({ username, password }) {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  // เผื่อ server ตอบไม่ใช่ JSON (เช่น error หน้า proxy)
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
  }
  return data; // { token, admin }
}
