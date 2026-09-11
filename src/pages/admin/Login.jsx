import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../lib/api.js';
import logo from '../../assets/images/logo.png';
import bg from '../../assets/images/admin-bg.svg';

// ─────────────────────────────────────────────────────────────
// หน้าเข้าสู่ระบบผู้ดูแล (Admin Login)
//   พื้นดำเทคโน + การ์ดขาว + ปุ่มส้มแบรนด์
//   ฟอร์ม controlled · โชว์/ซ่อนรหัส · สถานะ loading/error
//   สำเร็จ → เก็บ token ลง localStorage แล้วไป /admin
//   * ตอนนี้ backend ยังไม่เปิด กด "เข้าสู่ระบบ" จะขึ้นเชื่อมต่อไม่ได้ (ปกติ)
// ─────────────────────────────────────────────────────────────
export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    try {
      setLoading(true);
      const { token } = await loginAdmin({ username: username.trim(), password });
      localStorage.setItem('admin_token', token);
      navigate('/admin');
    } catch (err) {
      // fetch ต่อ server ไม่ติด → err.message = 'Failed to fetch'
      setError(
        err.message === 'Failed to fetch'
          ? 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ (ยังไม่ได้เปิด backend)'
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="relative grid min-h-screen place-items-center bg-ink bg-cover bg-center px-5 py-10"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        {/* โลโก้ + ชื่อแบรนด์ */}
        <div className="mb-6 flex flex-col items-center text-center">
          <img src={logo} alt="THERMO MANIQ" className="h-12 w-auto" />
          <span className="mt-2 text-lg font-extrabold tracking-tight">
            <span className="text-ink">THERMO</span> <span className="text-brand">MANIQ</span>
          </span>
          <h1 className="mt-4 text-xl font-bold text-ink">เข้าสู่ระบบผู้ดูแล</h1>
          <p className="mt-1 text-sm text-muted">สำหรับเจ้าหน้าที่ดูแลระบบเท่านั้น</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* ชื่อผู้ใช้ */}
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-ink">
              ชื่อผู้ใช้ หรือ อีเมล
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
              placeholder="admin"
            />
          </div>

          {/* รหัสผ่าน + ปุ่มโชว์/ซ่อน */}
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink">
              รหัสผ่าน
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-16 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 text-sm font-medium text-muted hover:text-brand"
                aria-label={showPw ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              >
                {showPw ? 'ซ่อน' : 'แสดง'}
              </button>
            </div>
          </div>

          {/* กล่องแจ้ง error */}
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          {/* ปุ่มเข้าสู่ระบบ */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        {/* กลับหน้าเว็บ */}
        <Link
          to="/"
          className="mt-6 block text-center text-sm text-muted transition-colors hover:text-brand"
        >
          ← กลับสู่หน้าเว็บหลัก
        </Link>
      </div>
    </main>
  );
}
