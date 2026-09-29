// ─────────────────────────────────────────────────────────────
// Admin Controller — เข้าสู่ระบบ
// ─────────────────────────────────────────────────────────────
import { asyncHandler } from '../../configs/async-handler.js';
import { AdminService } from '../../services/index.js';

export const AdminController = {
  login: asyncHandler(async (req, res) => {
    const result = await AdminService.login(req.body || {});
    res.json(result);
  }),

  // เข้าสู่ระบบด้วย Google (รับ { credential } = id_token)
  google: asyncHandler(async (req, res) => {
    const result = await AdminService.loginWithGoogle(req.body || {});
    res.json(result);
  }),
};
