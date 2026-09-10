import { useState } from 'react';
import Button from '../components/Button.jsx';
import logo from '../assets/images/logo.png';

// ─────────────────────────────────────────────────────────────
// แถบเมนูบนสุด — โลโก้ซ้าย · เมนูกลาง · ปุ่มติดต่อเราขวา
// พื้นไล่เทาอ่อน sticky ติดขอบบนตลอด · มีปุ่มแฮมเบอร์เกอร์บนมือถือ
// ─────────────────────────────────────────────────────────────
const MENU = [
  { label: 'หน้าแรก', href: '#hero', active: true },
  { label: 'เกี่ยวกับเรา', href: '#about' },
  { label: 'รับติดตั้งโซล่าเซลล์', href: '#install' },
  { label: 'สินค้าของเรา', href: '#products' },
  { label: 'ผลงานของเรา', href: '#works' },
  { label: 'ติดต่อเรา', href: '#contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-100 to-white shadow-sm">
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-3 lg:px-8">
        {/* โลโก้ */}
        <a href="#hero" className="flex items-center gap-2.5">
          <img src={logo} alt="THERMO MANIQ" className="h-9 w-auto" />
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-ink">THERMO</span>{' '}
            <span className="text-gray-400">MANIQ</span>
          </span>
        </a>

        {/* เมนูเดสก์ท็อป */}
        <nav className="hidden items-center gap-7 lg:flex">
          {MENU.map((m) => (
            <a
              key={m.href}
              href={m.href}
              className={`text-[15px] font-medium transition-colors hover:text-brand ${
                m.active ? 'border-b-2 border-brand pb-0.5 text-ink' : 'text-ink/80'
              }`}
            >
              {m.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="#contact" className="px-6 py-2.5">
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
          {MENU.map((m) => (
            <a
              key={m.href}
              href={m.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-[15px] font-medium text-ink/90 hover:bg-gray-100"
            >
              {m.label}
            </a>
          ))}
          <Button href="#contact" className="mt-2 justify-center">
            ติดต่อเรา
          </Button>
        </nav>
      )}
    </header>
  );
}
