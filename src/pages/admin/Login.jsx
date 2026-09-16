import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginAdmin, loginWithGoogle, saveAuth, GOOGLE_CLIENT_ID } from '../../lib/api.js';
import logo from '../../assets/images/logo.png';
import bg from '../../assets/images/admin-bg.svg';

// โลโก้ Google "G" 4 สี (สำหรับปุ่ม placeholder ตอนยังไม่ได้ตั้งค่า)
function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

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
  const googleBtnRef = useRef(null);

  // แปลงข้อความ error ให้อ่านง่าย (เชื่อม backend ไม่ติด vs ข้อความจาก server)
  const toMessage = (err) =>
    err.message === 'Failed to fetch'
      ? 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ (ยังไม่ได้เปิด backend)'
      : err.message;

  // สำเร็จแล้ว → เก็บ token+role · admin ไปแผงแอดมิน · ผู้ใช้ทั่วไปกลับหน้าแรก
  const onLoggedIn = ({ token, role }) => {
    saveAuth(token, role || 'admin');
    navigate(role === 'user' ? '/' : '/admin');
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    try {
      setLoading(true);
      const res = await loginAdmin({ username: username.trim(), password });
      onLoggedIn(res);
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setLoading(false);
    }
  }

  // โหลด Google Identity Services แล้ว render ปุ่มมาตรฐานของ Google
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return; // ยังไม่ตั้งค่า → ไม่โหลด (โชว์ปุ่ม placeholder แทน)
    const SRC = 'https://accounts.google.com/gsi/client';

    const render = () => {
      if (!window.google?.accounts?.id || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async ({ credential }) => {
          setError('');
          try {
            setLoading(true);
            const res = await loginWithGoogle(credential);
            onLoggedIn(res);
          } catch (err) {
            setError(toMessage(err));
            setLoading(false);
          }
        },
      });
      googleBtnRef.current.replaceChildren();
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text: 'signin_with',
        width: 320,
        locale: 'th',
      });
    };

    let script = document.querySelector(`script[src="${SRC}"]`);
    if (window.google?.accounts?.id) {
      render();
    } else if (script) {
      script.addEventListener('load', render);
    } else {
      script = document.createElement('script');
      script.src = SRC;
      script.async = true;
      script.defer = true;
      script.addEventListener('load', render);
      document.head.appendChild(script);
    }
    return () => script?.removeEventListener('load', render);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <h1 className="mt-4 text-xl font-bold text-ink">เข้าสู่ระบบ</h1>
          <p className="mt-1 text-sm text-muted">เข้าสู่ระบบด้วยอีเมลของคุณ</p>
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
              placeholder="อีเมลของคุณ"
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

        {/* คั่นด้วย "หรือ" */}
        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-muted">หรือ</span>
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        {/* ปุ่มเข้าสู่ระบบด้วย Google */}
        {GOOGLE_CLIENT_ID ? (
          <div ref={googleBtnRef} className="flex justify-center" />
        ) : (
          <div className="text-center">
            <button
              type="button"
              disabled
              title="ยังไม่ได้ตั้งค่า VITE_GOOGLE_CLIENT_ID"
              className="flex w-full items-center justify-center gap-3 rounded-full border border-gray-300 bg-white py-2.5 text-sm font-medium text-ink/70 disabled:cursor-not-allowed"
            >
              <GoogleIcon />
              เข้าสู่ระบบด้วย Google
            </button>
            <p className="mt-2 text-xs text-muted">* ตั้งค่า Google Client ID ใน .env ก่อนใช้งาน</p>
          </div>
        )}

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
