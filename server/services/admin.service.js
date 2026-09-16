// ─────────────────────────────────────────────────────────────
// Admin Service — เข้าสู่ระบบ: ตรวจรหัสด้วย bcrypt แล้วออก JWT
//   (สไตล์ cctv/user.service: sign token ในชั้น service)
// ─────────────────────────────────────────────────────────────
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { AdminModel } from '../models/index.js';
import { APP_CONFIG } from '../configs/app.js';
import { badRequest, unauthorized } from '../configs/http-error.js';

// ตัวตรวจ ID token ของ Google (สร้างครั้งเดียว ใช้ซ้ำ)
const googleClient = new OAuth2Client(APP_CONFIG.googleClientId);

// ออก JWT ของระบบเรา (ใช้ร่วมทั้ง login ปกติ + Google)
const signToken = (payload) =>
  jwt.sign(payload, APP_CONFIG.jwtSecret, { expiresIn: APP_CONFIG.jwtExpires });

export const AdminService = {
  login: async ({ username, password } = {}) => {
    if (!username || !password) throw badRequest('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');

    const admin = await AdminModel.findByUsername(username);
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      throw unauthorized('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }

    const token = signToken({ id: admin.id, username: admin.username, role: 'admin' });
    return { token, role: 'admin', admin: { id: admin.id, username: admin.username } };
  },

  // เข้าสู่ระบบด้วย Google — รับ id_token (credential) จากฝั่ง frontend
  //   เปิดให้ทุกคนล็อกอินได้ · อีเมลใน ALLOWED_GOOGLE_EMAILS → role 'admin'
  //   นอกนั้น → role 'user' (ผู้ใช้ทั่วไป เข้าแผงแอดมินไม่ได้)
  loginWithGoogle: async ({ credential } = {}) => {
    if (!APP_CONFIG.googleClientId) throw badRequest('ยังไม่ได้ตั้งค่า Google Login ที่เซิร์ฟเวอร์');
    if (!credential) throw badRequest('ไม่พบ token จาก Google');

    // ตรวจว่า token ออกโดย Google จริง + ออกให้ client id ของเรา
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: APP_CONFIG.googleClientId,
      });
      payload = ticket.getPayload();
    } catch {
      throw unauthorized('ยืนยันตัวตนกับ Google ไม่สำเร็จ');
    }

    const email = (payload.email || '').toLowerCase();
    if (!email || !payload.email_verified) {
      throw unauthorized('อีเมล Google ยังไม่ได้ยืนยัน');
    }

    // อีเมลใน allowlist ('*' = ทุกคน) → admin · นอกนั้น → user ทั่วไป
    const allow = APP_CONFIG.allowedGoogleEmails;
    const role = allow.includes('*') || allow.includes(email) ? 'admin' : 'user';

    const token = signToken({ email, name: payload.name, role, via: 'google' });
    return {
      token,
      role,
      admin: { username: email, name: payload.name, picture: payload.picture },
    };
  },
};
