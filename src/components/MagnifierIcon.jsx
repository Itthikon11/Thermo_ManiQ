// ─────────────────────────────────────────────────────────────
// ไอคอนแว่นขยาย — เส้นเรียบ สืบสีจากตัวอักษร (currentColor)
//   ใช้ทั้งเว็บ: ปุ่มดูรูปใหญ่ · ช่องค้นหา
// ─────────────────────────────────────────────────────────────
export default function MagnifierIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.5" y2="16.5" />
    </svg>
  );
}
