import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Button from '../components/Button.jsx';
import logo from '../assets/images/logo.png';

// ─────────────────────────────────────────────────────────────
// แถบเมนูบนสุด — โลโก้ซ้าย · เมนูกลาง · ปุ่มติดต่อเราขวา
// พื้นไล่เทาอ่อน sticky ติดขอบบนตลอด · มีปุ่มแฮมเบอร์เกอร์บนมือถือ
//   to   = ลิงก์ไปหน้าอื่น (react-router)
//   href = จุดยึด (#section) บนหน้าแรก
// ─────────────────────────────────────────────────────────────
const MENU = [
  { label: 'หน้าแรก', to: '/' },
  { label: 'เกี่ยวกับเรา', to: '/about' },
  { label: 'ประโยชน์ของโซล่าเซลล์', href: '/#install' },
  { label: 'สินค้าของเรา', to: '/products' },
  { label: 'ผลงานของเรา', to: '/works' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

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

        <div className="hidden lg:block">
          <Button href="https://line.me/R/ti/p/@288mrska" className="px-6 py-2.5">
            ติดต่อเรา
          </Button>
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
          <Button href="https://line.me/R/ti/p/@288mrska" className="mt-2 justify-center">
            ติดต่อเรา
          </Button>
        </nav>
      )}
    </header>
  );
}
