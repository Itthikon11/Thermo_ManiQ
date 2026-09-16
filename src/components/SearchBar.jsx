import MagnifierIcon from './MagnifierIcon.jsx';

// ─────────────────────────────────────────────────────────────
// ช่องค้นหาหน้าเว็บ (สินค้า / ผลงาน) — ไอคอนแว่นซ้าย · ปุ่มล้างขวา
// ขอบส้มตอนโฟกัส เข้าธีม THERMO MANIQ
// ─────────────────────────────────────────────────────────────
export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand">
        <MagnifierIcon className="h-5 w-5" />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-11 text-ink shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="ล้างคำค้นหา"
          className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-lg leading-none text-muted transition hover:bg-gray-100 hover:text-ink"
        >
          ×
        </button>
      )}
    </div>
  );
}
