import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Button from '../common/Button.jsx';
import { getAuth, logout } from '../../helper/api.js';
import logo from '../../assets/images/logo.png';

// ─────────────────────────────────────────────────────────────
// แถบเมนูบนสุด — โลโก้ซ้าย · เมนูกลาง · ปุ่มติดต่อเราขวา
// พื้นไล่เทาอ่อน sticky ติดขอบบนตลอด · มีปุ่มแฮมเบอร์เกอร์บนมือถือ
//   to   = ลิงก์ไปหน้าอื่น (react-router)
//   href = จุดยึด (#section) บนหน้าแรก
// ─────────────────────────────────────────────────────────────
const MENU = [
  { label: 'หน้าแรก', to: '/' },
  { label: 'เกี่ยวกับเรา', to: '/about' },
  { label: 'ประโยชน์ของโซล่าเซลล์', to: '/benefits' },
  { label: 'สินค้าของเรา', to: '/products' },
  { label: 'ผลงานของเรา', to: '/works' },
];

// ไอคอนประตูทางเข้า (login) — เส้นบาง สืบสีจากตัวอักษร
function LoginIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );
}

// ไอคอนแผงควบคุม (เมนูแอดมิน)
function AdminIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

// ปุ่มเข้าสู่ระบบ/ออกจากระบบ — สไตล์ outline เบา ๆ วางข้างปุ่ม "ติดต่อเรา"
const loginBtnClass =
  'inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-[15px] font-semibold text-ink/90 transition-colors hover:border-brand hover:text-brand';

// เมนูแอดมิน — เน้นสีแบรนด์ให้เด่นกว่าปุ่มทั่วไป
const adminBtnClass =
  'inline-flex items-center gap-2 rounded-full bg-brand/10 px-5 py-2.5 text-[15px] font-semibold text-brand transition-colors hover:bg-brand/20';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // สถานะล็อกอิน — อ่านใหม่ทุกครั้งที่เปลี่ยนหน้า + เมื่อมี event 'auth-change'/storage
  const [auth, setAuth] = useState(getAuth());
  useEffect(() => {
    const sync = () => setAuth(getAuth());
    sync();
    window.addEventListener('auth-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('auth-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, [pathname]);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/');
  }

  const base = 'text-[15px] font-medium transition-colors hover:text-brand';

  // เมนูหน้า (to) ใช้ NavLink → หน้าปัจจุบันเป็นสีส้ม · จุดยึด (href) เป็นสีเทาปกติ
  const renderLink = (m, onClick, extra = '') =>
    m.to ? (
      <NavLink
        key={m.label}
        to={m.to}
        end={m.to === '/'}
        onClick={(e) => {
          // อยู่หน้าแรกอยู่แล้ว → เลื่อนสไลด์ขึ้นบนสุดแบบนุ่มนวล
          if (m.to === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
          onClick?.(e);
        }}
        className={({ isActive }) =>
          `${base} ${extra} ${isActive ? 'text-brand' : 'text-ink/80'}`
        }
      >
        {m.label}
      </NavLink>
    ) : (
      <a key={m.label} href={m.href} onClick={onClick} className={`${base} text-ink/80 ${extra}`}>
        {m.label}
      </a>
    );

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-100 to-white shadow-sm">
      <div className="flex w-full items-center justify-between px-5 py-3 lg:px-10">
        {/* โลโก้ */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="THERMO MANIQ" className="h-9 w-auto" />
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-ink">THERMO</span>{' '}
            <span className="text-brand">MANIQ</span>
          </span>
        </Link>

        {/* เมนูเดสก์ท็อป */}
        <nav className="hidden items-center gap-7 lg:flex">
          {MENU.map((m) => renderLink(m))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {auth.role === 'admin' && (
            <Link to="/admin" className={adminBtnClass}>
              <AdminIcon />
              แอดมิน
            </Link>
          )}
          {auth.token ? (
            <button type="button" onClick={handleLogout} className={loginBtnClass}>
              <LoginIcon />
              ออกจากระบบ
            </button>
          ) : (
            <Link to="/admin/login" className={loginBtnClass}>
              <LoginIcon />
              เข้าสู่ระบบ
            </Link>
          )}
          {/* แอดมินไม่ต้องเห็นปุ่มติดต่อเรา */}
          {auth.role !== 'admin' && (
            <Button href="https://line.me/R/ti/p/@288mrska" className="px-6 py-2.5">
              ติดต่อเรา
            </Button>
          )}
        </div>

        {/* ปุ่มแฮมเบอร์เกอร์ (มือถือ) */}
        <button
          className="grid gap-1.5 p-2 lg:hidden"
          aria-label="เมนู"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="h-0.5 w-6 bg-ink" />
          <span className="h-0.5 w-6 bg-ink" />
          <span className="h-0.5 w-6 bg-ink" />
        </button>
      </div>

      {/* เมนูมือถือ */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-gray-200 bg-white px-5 py-3 lg:hidden">
          {MENU.map((m) =>
            renderLink(m, () => setOpen(false), 'rounded-lg px-3 py-2 hover:bg-gray-100'),
          )}
          {auth.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className={`${adminBtnClass} mt-2 justify-center`}
            >
              <AdminIcon />
              แอดมิน
            </Link>
          )}
          {auth.token ? (
            <button
              type="button"
              onClick={handleLogout}
              className={`${loginBtnClass} mt-2 justify-center`}
            >
              <LoginIcon />
              ออกจากระบบ
            </button>
          ) : (
            <Link
              to="/admin/login"
              onClick={() => setOpen(false)}
              className={`${loginBtnClass} mt-2 justify-center`}
            >
              <LoginIcon />
              เข้าสู่ระบบ
            </Link>
          )}
          {auth.role !== 'admin' && (
            <Button href="https://line.me/R/ti/p/@288mrska" className="mt-2 justify-center">
              ติดต่อเรา
            </Button>
          )}
        </nav>
      )}
    </header>
  );
}
